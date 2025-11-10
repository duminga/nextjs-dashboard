import {prismaclinet} from '@/app/lib/db/prisma';

async function listInvoices() {
  // 使用 Prisma 的关系查询，一次性获取发票和客户信息
  const data = await prismaclinet.invoices.findMany({
    where: {
      amount: 666,
    },
    select: {
      amount: true,
      customer: {
        select: {
          name: true,
        },
      },
    },
  });

  // 转换数据格式
  return data.map((invoice) => ({
    amount: invoice.amount,
    name: invoice.customer.name,
  }));
}

export async function GET() {
  try {
    return Response.json(await listInvoices());
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
