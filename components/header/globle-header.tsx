import { Search } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button, Input } from "../ui";

interface Action {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  variant?: "default" | "outline" | "ghost";
  disabled?: boolean;
  loading?: boolean;
}

interface BreadcrumbItem {
  label: string;
  onClick?: () => void;
}

interface PageHeaderProps {
  title: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: Action[];
  showSearch?: boolean;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  showShopSelector?: boolean;
  selectedShop?: string;
  shops?: string[];
  onShopChange?: (shop: string) => void;
  notificationCount?: number;
  onNotificationClick?: () => void;
  userAvatarUrl?: string;
  onUserAvatarClick?: () => void;
}

export default function PageHeader({
  title,
  breadcrumbs,
  actions = [],
  showSearch = false,
  searchPlaceholder = "Search...",
  searchValue,
  onSearchChange,
  showShopSelector = true,
  selectedShop = "Nik Shop",
  shops = ["Nik Shop", "Shop 1", "Shop 2"],
  onShopChange,
  notificationCount = 0,
  onNotificationClick,
  userAvatarUrl,
  onUserAvatarClick,
}: PageHeaderProps) {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="px-8 py-6">
        {/* Top Row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>

          {/* Right Side Controls */}
          <div className="flex items-center gap-4">
            {showShopSelector && (
              <Select value={selectedShop} onValueChange={onShopChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {shops.map((shop) => (
                    <SelectItem key={shop} value={shop}>
                      {shop}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                className="relative p-2"
                onClick={onNotificationClick}
              >
                <span className="text-xl">🔔</span>
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center font-medium">
                    {notificationCount}
                  </span>
                )}
              </Button>
            </div>

            <button
              onClick={onUserAvatarClick}
              className="w-8 h-8 bg-gray-300 rounded-full overflow-hidden hover:opacity-80 transition-opacity"
            >
              {userAvatarUrl && (
                <img
                  src={userAvatarUrl}
                  alt="User avatar"
                  className="w-full h-full object-cover"
                />
              )}
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-4">
          {/* Breadcrumbs */}
          {breadcrumbs && breadcrumbs.length > 0 && (
            <div className="flex items-center gap-2 text-sm">
              {breadcrumbs.map((crumb, index) => (
                <div key={index} className="flex items-center gap-2">
                  {crumb.onClick ? (
                    <button
                      onClick={crumb.onClick}
                      className="text-blue-600 hover:underline"
                    >
                      {crumb.label}
                    </button>
                  ) : (
                    <span className="text-gray-600 text-nowrap">{crumb.label}</span>
                  )}
                  {index < breadcrumbs.length - 1 && (
                    <span className="text-gray-400">{">"}</span>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Bottom Row: Search + Actions */}
          {(showSearch || actions.length > 0) && (
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              {showSearch && (
                <div className="flex-1 max-w-md">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      type="text"
                      placeholder={searchPlaceholder}
                      className="pl-10 bg-gray-50 border-gray-200"
                      value={searchValue}
                      onChange={(e) => onSearchChange?.(e.target.value)}
                    />
                  </div>
                </div>
              )}

              {actions.length > 0 && (
                <div className="flex items-center gap-3 ml-auto">
                  {actions.map((action, index) => (
                    <Button
                      key={index}
                      variant={action.variant || "default"}
                      className={
                        !action.variant || action.variant === "default"
                          ? "gap-2 bg-blue-600 hover:bg-blue-700"
                          : "gap-2"
                      }
                      onClick={action.onClick}
                      disabled={action.disabled || action.loading}
                    >
                      {action.icon}
                      {action.loading ? `${action.label}...` : action.label}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
