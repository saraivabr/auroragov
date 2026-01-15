import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { UsageStats, UsageSummary, ModelStats, AgentStats } from '@/types/openrouter';

interface UseUsageStatsReturn {
  stats: UsageSummary | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useUsageStats(
  userId: string | undefined,
  period: 'day' | 'week' | 'month' = 'month'
): UseUsageStatsReturn {
  const [stats, setStats] = useState<UsageSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const now = new Date();
      let startDate: Date;

      switch (period) {
        case 'day':
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          break;
        case 'week':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'month':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
      }

      const { data, error: fetchError } = await supabase
        .from('usage_stats')
        .select('*')
        .eq('user_id', userId)
        .gte('date', startDate.toISOString().split('T')[0])
        .order('date', { ascending: true });

      if (fetchError) throw fetchError;

      const usageData = data as UsageStats[];

      const totalMessages = usageData.reduce((sum, stat) => sum + stat.total_messages, 0);
      const totalTokensInput = usageData.reduce((sum, stat) => sum + stat.total_tokens_input, 0);
      const totalTokensOutput = usageData.reduce((sum, stat) => sum + stat.total_tokens_output, 0);
      const totalCostUsd = usageData.reduce((sum, stat) => sum + Number(stat.total_cost_usd), 0);

      const modelStatsMap = new Map<string, ModelStats>();
      const agentStatsMap = new Map<string, AgentStats>();
      const dailyBreakdownMap = new Map<string, { messages: number; cost_usd: number }>();

      usageData.forEach((stat) => {
        if (stat.model_id) {
          const existing = modelStatsMap.get(stat.model_id) || {
            model_id: stat.model_id,
            display_name: stat.model_id,
            total_messages: 0,
            total_tokens: 0,
            total_cost_usd: 0,
            percentage: 0,
          };

          existing.total_messages += stat.total_messages;
          existing.total_tokens += stat.total_tokens_input + stat.total_tokens_output;
          existing.total_cost_usd += Number(stat.total_cost_usd);

          modelStatsMap.set(stat.model_id, existing);
        }

        if (stat.agent_id) {
          const existing = agentStatsMap.get(stat.agent_id) || {
            agent_id: stat.agent_id,
            total_messages: 0,
            total_tokens: 0,
            total_cost_usd: 0,
          };

          existing.total_messages += stat.total_messages;
          existing.total_tokens += stat.total_tokens_input + stat.total_tokens_output;
          existing.total_cost_usd += Number(stat.total_cost_usd);

          agentStatsMap.set(stat.agent_id, existing);
        }

        const existing = dailyBreakdownMap.get(stat.date) || { messages: 0, cost_usd: 0 };
        existing.messages += stat.total_messages;
        existing.cost_usd += Number(stat.total_cost_usd);
        dailyBreakdownMap.set(stat.date, existing);
      });

      const byModel = Array.from(modelStatsMap.values()).map((stat) => ({
        ...stat,
        percentage: totalMessages > 0 ? (stat.total_messages / totalMessages) * 100 : 0,
      })).sort((a, b) => b.total_messages - a.total_messages);

      const byAgent = Array.from(agentStatsMap.values()).sort(
        (a, b) => b.total_messages - a.total_messages
      );

      const dailyBreakdown = Array.from(dailyBreakdownMap.entries())
        .map(([date, data]) => ({
          date,
          messages: data.messages,
          cost_usd: data.cost_usd,
        }))
        .sort((a, b) => a.date.localeCompare(b.date));

      const summary: UsageSummary = {
        period,
        total_messages: totalMessages,
        total_tokens_input: totalTokensInput,
        total_tokens_output: totalTokensOutput,
        total_cost_usd: totalCostUsd,
        by_model: byModel,
        by_agent: byAgent,
        daily_breakdown: dailyBreakdown,
      };

      setStats(summary);
    } catch (err) {
      console.error('Error fetching usage stats:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch usage stats');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [userId, period]);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats,
  };
}
