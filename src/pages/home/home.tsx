import { usePageCrumbs } from "@features/usePageCrumbs";
import { Sparkles, BarChart3, Users, ShoppingCart, TrendingUp } from "lucide-react";

export const HomePage = () => {
  usePageCrumbs("Дашборды");

  const stats = [
    {
      icon: Users,
      title: "Клиенты",
      value: "1,234",
      change: "+12%",
      color: "text-purple-400"
    },
    {
      icon: ShoppingCart,
      title: "Заказы",
      value: "567",
      change: "+8%",
      color: "text-purple-500"
    },
    {
      icon: TrendingUp,
      title: "Выручка",
      value: "₽45,678",
      change: "+15%",
      color: "text-purple-600"
    },
    {
      icon: BarChart3,
      title: "Конверсия",
      value: "23.4%",
      change: "+3%",
      color: "text-purple-700"
    }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-2">
          <Sparkles className="w-8 h-8 text-purple-500" />
          <h1 className="text-4xl font-bold text-foreground">
            Дашборд
          </h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Добро пожаловать в панель управления вашим рестораном
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <stat.icon className="w-6 h-6 text-primary" />
              </div>
              <span className="text-sm font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
                {stat.change}
              </span>
            </div>
            
            <h3 className="text-2xl font-bold mb-1 text-foreground">
              {stat.value}
            </h3>
            
            <p className="text-muted-foreground text-sm">
              {stat.title}
            </p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-card border border-border rounded-xl p-8 shadow-sm">
        <h2 className="text-2xl font-bold mb-6 text-foreground">
          Быстрые действия
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 bg-secondary hover:bg-secondary/80 rounded-xl border border-border transition-colors">
            <span className="text-secondary-foreground font-medium">
              Добавить блюдо
            </span>
          </button>
          <button className="p-4 bg-secondary hover:bg-secondary/80 rounded-xl border border-border transition-colors">
            <span className="text-secondary-foreground font-medium">
              Управление заказами
            </span>
          </button>
          <button className="p-4 bg-secondary hover:bg-secondary/80 rounded-xl border border-border transition-colors">
            <span className="text-secondary-foreground font-medium">
              Настройки
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}