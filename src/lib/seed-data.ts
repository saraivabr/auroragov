import { supabase } from './supabase'

export async function seedDatabase() {
  console.log('Starting database seeding...')

  try {
    const invoicesData = [
      {
        invoice_number: 'INV001',
        customer_name: 'Acme Corporation',
        customer_email: 'billing@acme.com',
        status: 'paid',
        payment_method: 'Credit Card',
        amount: 2500.00,
        date: '2024-01-15',
        notes: 'Q1 2024 services',
      },
      {
        invoice_number: 'INV002',
        customer_name: 'Tech Solutions Inc',
        customer_email: 'accounts@techsol.com',
        status: 'pending',
        payment_method: 'PayPal',
        amount: 1850.00,
        date: '2024-01-20',
        notes: 'Development work',
      },
      {
        invoice_number: 'INV003',
        customer_name: 'Global Enterprises',
        customer_email: 'finance@global.com',
        status: 'unpaid',
        payment_method: 'Bank Transfer',
        amount: 4200.00,
        date: '2024-01-18',
        notes: 'Annual subscription',
      },
      {
        invoice_number: 'INV004',
        customer_name: 'StartupXYZ',
        customer_email: 'billing@startupxyz.com',
        status: 'paid',
        payment_method: 'Stripe',
        amount: 950.00,
        date: '2024-01-22',
        notes: 'Consulting services',
      },
      {
        invoice_number: 'INV005',
        customer_name: 'Enterprise Co',
        customer_email: 'payments@enterprise.com',
        status: 'paid',
        payment_method: 'Credit Card',
        amount: 3200.00,
        date: '2024-01-25',
        notes: 'Project milestone 1',
      },
    ]

    const { error: invoicesError } = await supabase
      .from('invoices')
      .insert(invoicesData)

    if (invoicesError) throw invoicesError
    console.log('✓ Seeded invoices')

    const usersData = [
      {
        name: 'Alice Johnson',
        email: 'alice@example.com',
        role: 'admin',
        status: 'active',
        projects_count: 15,
        last_login: new Date().toISOString(),
      },
      {
        name: 'Bob Smith',
        email: 'bob@example.com',
        role: 'developer',
        status: 'active',
        projects_count: 8,
        last_login: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        name: 'Carol White',
        email: 'carol@example.com',
        role: 'designer',
        status: 'inactive',
        projects_count: 5,
        last_login: new Date(Date.now() - 2592000000).toISOString(),
      },
      {
        name: 'David Brown',
        email: 'david@example.com',
        role: 'developer',
        status: 'active',
        projects_count: 12,
        last_login: new Date().toISOString(),
      },
      {
        name: 'Eve Davis',
        email: 'eve@example.com',
        role: 'manager',
        status: 'active',
        projects_count: 20,
        last_login: new Date(Date.now() - 43200000).toISOString(),
      },
    ]

    const { error: usersError } = await supabase
      .from('app_users')
      .insert(usersData)

    if (usersError) throw usersError
    console.log('✓ Seeded users')

    const productsData = [
      {
        name: 'Wireless Mouse',
        description: 'Ergonomic wireless mouse with USB receiver',
        sku: 'WM-001',
        category: 'Electronics',
        price: 29.99,
        stock: 150,
        is_active: true,
      },
      {
        name: 'Mechanical Keyboard',
        description: 'RGB backlit mechanical gaming keyboard',
        sku: 'KB-002',
        category: 'Electronics',
        price: 89.99,
        stock: 75,
        is_active: true,
      },
      {
        name: 'USB-C Hub',
        description: '7-in-1 USB-C hub with HDMI and ethernet',
        sku: 'HUB-003',
        category: 'Accessories',
        price: 45.50,
        stock: 200,
        is_active: true,
      },
      {
        name: 'Laptop Stand',
        description: 'Aluminum adjustable laptop stand',
        sku: 'LS-004',
        category: 'Accessories',
        price: 34.99,
        stock: 8,
        is_active: true,
      },
      {
        name: 'Webcam HD',
        description: '1080p HD webcam with built-in microphone',
        sku: 'WC-005',
        category: 'Electronics',
        price: 59.99,
        stock: 3,
        is_active: true,
      },
      {
        name: 'Monitor 27"',
        description: '27-inch 4K IPS monitor',
        sku: 'MON-006',
        category: 'Electronics',
        price: 399.99,
        stock: 25,
        is_active: true,
      },
      {
        name: 'Desk Lamp',
        description: 'LED desk lamp with touch control',
        sku: 'DL-007',
        category: 'Office',
        price: 24.99,
        stock: 100,
        is_active: false,
      },
    ]

    const { error: productsError } = await supabase
      .from('products')
      .insert(productsData)

    if (productsError) throw productsError
    console.log('✓ Seeded products')

    const auditLogsData = [
      {
        user_name: 'Alice Johnson',
        action: 'CREATE',
        entity_type: 'invoice',
        details: 'Created invoice INV001',
      },
      {
        user_name: 'Bob Smith',
        action: 'UPDATE',
        entity_type: 'product',
        details: 'Updated stock for Wireless Mouse',
      },
      {
        user_name: 'Eve Davis',
        action: 'DELETE',
        entity_type: 'user',
        details: 'Removed inactive user account',
      },
      {
        user_name: 'David Brown',
        action: 'CREATE',
        entity_type: 'product',
        details: 'Added new product: Monitor 27"',
      },
      {
        user_name: 'Alice Johnson',
        action: 'UPDATE',
        entity_type: 'invoice',
        details: 'Marked invoice INV004 as paid',
      },
    ]

    const { error: auditLogsError } = await supabase
      .from('audit_logs')
      .insert(auditLogsData)

    if (auditLogsError) throw auditLogsError
    console.log('✓ Seeded audit logs')

    console.log('Database seeding completed successfully!')
    return { success: true }
  } catch (error) {
    console.error('Error seeding database:', error)
    return { success: false, error }
  }
}

export async function clearDatabase() {
  console.log('Clearing database...')

  try {
    await supabase.from('audit_logs').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    await supabase.from('invoices').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    await supabase.from('app_users').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    await supabase.from('products').delete().neq('id', '00000000-0000-0000-0000-000000000000')

    console.log('Database cleared successfully!')
    return { success: true }
  } catch (error) {
    console.error('Error clearing database:', error)
    return { success: false, error }
  }
}
