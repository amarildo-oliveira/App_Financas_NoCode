import {
  LayoutDashboard,
  ListChecks,
  PieChart,
  Search,
  Download,
  Smartphone,
} from "lucide-react";

const FEATURES = [
  {
    icon: LayoutDashboard,
    title: "Dashboard consolidado",
    description:
      "Veja receita total, despesa total e saldo do mês em cards claros e diretos.",
  },
  {
    icon: ListChecks,
    title: "Transações completas",
    description:
      "Crie, edite e exclua receitas e despesas com descrição, valor, data e categoria.",
  },
  {
    icon: PieChart,
    title: "Gráficos por categoria",
    description:
      "Entenda visualmente onde seu dinheiro está indo com um gráfico de pizza.",
  },
  {
    icon: Search,
    title: "Busca e filtros",
    description:
      "Filtre por mês, ano e categoria, ou busque transações pela descrição.",
  },
  {
    icon: Download,
    title: "Exportação em CSV",
    description:
      "Exporte suas transações filtradas para planilha com um clique.",
  },
  {
    icon: Smartphone,
    title: "100% responsivo",
    description:
      "Use no computador ou no celular com uma interface adaptada para você.",
  },
];

export function Features() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-16">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((feature) => (
          <div
            key={feature.title}
            className="rounded-lg border bg-card p-6 shadow-sm"
          >
            <feature.icon className="h-6 w-6 text-primary" />
            <h3 className="mt-4 font-semibold">{feature.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
