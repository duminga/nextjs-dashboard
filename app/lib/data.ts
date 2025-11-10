import { prismaclinet } from './db/prisma';
import {
  CustomerField,
  CustomersTableType,
  InvoiceForm,
  InvoicesTable,
  LatestInvoiceRaw,
  Revenue,
} from './definitions';
import { formatCurrency } from './utils';

export async function fetchRevenue() {
  try {
    // 为了演示目的，人为延迟响应。
    // 不要在生产环境中这样做 :)

    // console.log('正在获取收入数据...');
    // await new Promise((resolve) => setTimeout(resolve, 3000));

    const data = await prismaclinet.revenue.findMany();

    // console.log('数据获取在 3 秒后完成。');

    return data as Revenue[];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch revenue data.');
  }
}

export async function fetchLatestInvoices() {
  try {
    const data = await prismaclinet.invoices.findMany({
      take: 5,
      orderBy: {
        date: 'desc',
      },
      select: {
        id: true,
        amount: true,
        customer: {
          select: {
            name: true,
            image_url: true,
            email: true,
          },
        },
      },
    });

    const latestInvoices = data.map((invoice: typeof data[0]) => ({
      id: invoice.id,
      amount: formatCurrency(invoice.amount),
      name: invoice.customer.name,
      image_url: invoice.customer.image_url,
      email: invoice.customer.email,
    }));
    return latestInvoices;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the latest invoices.');
  }
}

export async function fetchCardData() {
  try {
    // 并行执行多个查询
    const [invoiceCount, customerCount, invoiceStatus] = await Promise.all([
      prismaclinet.invoices.count(),
      prismaclinet.customers.count(),
      prismaclinet.invoices.aggregate({
        _sum: {
          amount: true,
        },
        where: {
          OR: [
            { status: 'paid' },
            { status: 'pending' },
          ],
        },
      }),
    ]);

    // 分别计算 paid 和 pending 的总额
    const paidInvoices = await prismaclinet.invoices.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        status: 'paid',
      },
    });

    const pendingInvoices = await prismaclinet.invoices.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        status: 'pending',
      },
    });

    const numberOfInvoices = invoiceCount;
    const numberOfCustomers = customerCount;
    const totalPaidInvoices = formatCurrency(paidInvoices._sum.amount ?? 0);
    const totalPendingInvoices = formatCurrency(pendingInvoices._sum.amount ?? 0);

    return {
      numberOfCustomers,
      numberOfInvoices,
      totalPaidInvoices,
      totalPendingInvoices,
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch card data.');
  }
}

const ITEMS_PER_PAGE = 6;
export async function fetchFilteredInvoices(
  query: string,
  currentPage: number,
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const invoices = await prismaclinet.invoices.findMany({
      skip: offset,
      take: ITEMS_PER_PAGE,
      where: {
        OR: [
          {
            customer: {
              name: {
                contains: query,
                mode: 'insensitive',
              },
            },
          },
          {
            customer: {
              email: {
                contains: query,
                mode: 'insensitive',
              },
            },
          },
          {
            amount: {
              equals: isNaN(Number(query)) ? undefined : Number(query),
            },
          },
          {
            status: {
              contains: query,
              mode: 'insensitive',
            },
          },
        ],
      },
      orderBy: {
        date: 'desc',
      },
      select: {
        id: true,
        customer_id: true,
        amount: true,
        date: true,
        status: true,
        customer: {
          select: {
            name: true,
            email: true,
            image_url: true,
          },
        },
      },
    });

    const result: InvoicesTable[] = invoices.map((invoice: typeof invoices[0]) => ({
      id: invoice.id,
      customer_id: invoice.customer_id,
      amount: invoice.amount,
      date: invoice.date.toISOString(),
      status: invoice.status as 'pending' | 'paid',
      name: invoice.customer.name,
      email: invoice.customer.email,
      image_url: invoice.customer.image_url,
    }));

    return result;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoices.');
  }
}

export async function fetchInvoicesPages(query: string) {
  try {
    const count = await prismaclinet.invoices.count({
      where: {
        OR: [
          {
            customer: {
              name: {
                contains: query,
                mode: 'insensitive',
              },
            },
          },
          {
            customer: {
              email: {
                contains: query,
                mode: 'insensitive',
              },
            },
          },
          {
            amount: {
              equals: isNaN(Number(query)) ? undefined : Number(query),
            },
          },
          {
            status: {
              contains: query,
              mode: 'insensitive',
            },
          },
        ],
      },
    });

    const totalPages = Math.ceil(count / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of invoices.');
  }
}

export async function fetchInvoiceById(id: string) {
  try {
    const invoice = await prismaclinet.invoices.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        customer_id: true,
        amount: true,
        status: true,
      },
    });

    if (!invoice) {
      throw new Error('Invoice not found');
    }

    const result: InvoiceForm = {
      id: invoice.id,
      customer_id: invoice.customer_id,
      status: invoice.status as 'pending' | 'paid',
      // 将金额从美分转换为美元
      amount: invoice.amount / 100,
    };

    return result;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoice.');
  }
}

export async function fetchCustomers() {
  try {
    const customers = await prismaclinet.customers.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    return customers as CustomerField[];
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all customers.');
  }
}

export async function fetchFilteredCustomers(query: string) {
  try {
    const customers = await prismaclinet.customers.findMany({
      where: {
        OR: [
          {
            name: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            email: {
              contains: query,
              mode: 'insensitive',
            },
          },
        ],
      },
      select: {
        id: true,
        name: true,
        email: true,
        image_url: true,
        invoices: {
          select: {
            id: true,
            amount: true,
            status: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    const result: CustomersTableType[] = customers.map((customer: typeof customers[0]) => {
      const totalInvoices = customer.invoices.length;
      const totalPending = customer.invoices
        .filter((inv: typeof customer.invoices[0]) => inv.status === 'pending')
        .reduce((sum: number, inv: typeof customer.invoices[0]) => sum + inv.amount, 0);
      const totalPaid = customer.invoices
        .filter((inv: typeof customer.invoices[0]) => inv.status === 'paid')
        .reduce((sum: number, inv: typeof customer.invoices[0]) => sum + inv.amount, 0);

      return {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        image_url: customer.image_url,
        total_invoices: totalInvoices,
        total_pending: totalPending,
        total_paid: totalPaid,
      };
    });

    return result;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch customer table.');
  }
}
