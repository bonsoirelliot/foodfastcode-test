import { usePageCrumbs } from "@features/usePageCrumbs";

export const HomePage = () => {
  usePageCrumbs("Дашборды");

  return (
    <div className="w-full max-w-[1440px] px-4 space-y-6">
      {/* Заголовок */}
      <div className="bg-card rounded-lg p-6 border shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Дашборд</h1>
            <p className="text-muted-foreground">
              Обзор статистики ваших заведений
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-muted-foreground">Сегодня</div>
            <div className="text-2xl font-bold text-primary">
              {new Date().toLocaleDateString('ru-RU')}
            </div>
          </div>
      {/* Статистические карточки */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-card rounded-lg p-6 border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Заведения</p>
              <p className="text-2xl font-bold text-foreground">0</p>
            </div>
            <div className="text-3xl">🏪</div>
          </div>
        </div>
        
        <div className="bg-card rounded-lg p-6 border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Заказы сегодня</p>
              <p className="text-2xl font-bold text-foreground">0</p>
            </div>
            <div className="text-3xl">📋</div>
          </div>
        </div>
        
        <div className="bg-card rounded-lg p-6 border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Выручка</p>
              <p className="text-2xl font-bold text-foreground">0 ₽</p>
            </div>
            <div className="text-3xl">💰</div>
          </div>
        </div>
        
        <div className="bg-card rounded-lg p-6 border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Клиенты</p>
              <p className="text-2xl font-bold text-foreground">0</p>
            </div>
            <div className="text-3xl">👥</div>
          </div>
        </div>
      </div>
        </div>
      {/* Быстрые действия */}
      <div className="bg-card rounded-lg p-6 border shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Быстрые действия</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button variant="outline" className="h-20 flex-col gap-2" asChild>
            <Link to="/create-place">
              <div className="text-2xl">🏪</div>
              <span>Создать заведение</span>
            </Link>
          </Button>
          
          <Button variant="outline" className="h-20 flex-col gap-2" asChild>
            <Link to="/places">
              <div className="text-2xl">📋</div>
              <span>Управление меню</span>
            </Link>
          </Button>
          
          <Button variant="outline" className="h-20 flex-col gap-2" asChild>
            <Link to="/settings">
              <div className="text-2xl">⚙️</div>
              <span>Настройки</span>
            </Link>
          </Button>
        </div>
      </div>
      </div>
      {/* Заглушка для будущих графиков */}
      <div className="bg-card rounded-lg p-6 border shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Аналитика</h2>
        <div className="h-64 bg-muted/30 rounded-lg flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <div className="text-4xl mb-2">📊</div>
            <p>Графики и аналитика будут доступны</p>
            <p className="text-sm">после создания первого заведения</p>
          </div>
        </div>
      </div>
    </div>
  )
}