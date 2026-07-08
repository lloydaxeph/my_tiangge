import { Store } from "lucide-react";
import { Card } from "../common/Card";
import { DisableToggleButton } from "./DisableToggleButton";
import type { Profile } from "../../types/domain";

export function UserCard({
  user,
  onToggleDisabled,
}: {
  user: Profile;
  onToggleDisabled: (disabled: boolean) => void;
}) {
  return (
    <Card className="flex items-center gap-4">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-neutral-100">
        <Store className="h-6 w-6 text-neutral-400" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-lg font-semibold text-neutral-900">
          {user.store_name || "(no store name)"}
        </p>
        <p className="truncate text-base text-neutral-500">{user.owner_name}</p>
      </div>
      <DisableToggleButton disabled={user.is_disabled} onToggle={onToggleDisabled} />
    </Card>
  );
}
