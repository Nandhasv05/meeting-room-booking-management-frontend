// AUTHOR : NANDNHAKUMAR SV 
// DATE : 28/08/2026
// DESCRIPTION : Roles page to view roles
import { useCallback, useEffect, useState } from 'react';
import { celebrate } from '../../components/ui/SuccessFx';
import { EmptyState, PageHeader, Spinner } from '../../components/ui/Feedback';
import { Card, CardHeader } from '../../components/ui/Surface';
import { useAppDispatch, useAppSelector } from '../../store';
import {
  fetchPermissionsStart,
  fetchRoleDetailStart,
  fetchRolesStart,
  saveRolePermissionsResponseResetStart,
  saveRolePermissionsStart,
} from '../../redux/roles/roles.action';
import {
  selectPermissions,
  selectRoleDetail,
  selectRoles,
  selectRolesLoading,
  selectSaveRoleResponse,
} from '../../redux/roles/roles.selector';
import { useReduxResponse } from '../../redux/_common/useReduxResponse';
import { Role, Perm } from '../../helpers/role/roleValidation';

export function RolesPage() {

  /******* STATE *******/
  const dispatch = useAppDispatch();
  const [selected, setSelected] = useState<string | null>(null);

  /******* SELECTORS *******/
  const roles = useAppSelector(selectRoles) as Role[] | undefined;
  const isLoading = useAppSelector(selectRolesLoading);
  const allPerms = useAppSelector(selectPermissions) as Perm[] | undefined;
  const detail = useAppSelector(selectRoleDetail) as (Role & { permissions: Perm[] }) | null;

  /******* STATE *******/
  const saveResponse = useAppSelector(selectSaveRoleResponse);

  /******* EFFECTS *******/
  useEffect(() => {
    dispatch(fetchRolesStart());
    dispatch(fetchPermissionsStart());
  }, [dispatch]);

  useEffect(() => {
    if (selected) dispatch(fetchRoleDetailStart({ id: selected }));
  }, [selected, dispatch]);

  /******* HANDLERS *******/
  const resetSave = useCallback(() => dispatch(saveRolePermissionsResponseResetStart()), [dispatch]);
  useReduxResponse(saveResponse, resetSave, () => {
    celebrate('Permissions saved');
    if (selected) dispatch(fetchRoleDetailStart({ id: selected }));
  });

  const current = new Set((detail?.permissions ?? []).map((p) => p.Id));
  const modules = [...new Set((allPerms ?? []).map((p) => p.Module))].sort();

  return (
    <div>
      <PageHeader title="Roles & permissions" description="Pick a role, then toggle what it can reach." />
      {isLoading ? <Spinner /> : null}
      <div className="grid gap-4 lg:grid-cols-[18rem_1fr]">
        <Card padded={false}>
          <ul className="divide-y divide-navy-800/8">
            {(roles ?? []).map((r) => (
              <li key={r.Id}>
                <button
                  type="button"
                  className={`flex w-full items-center justify-between gap-2 px-4 py-3 text-left text-sm transition ${
                    selected === r.Id ? 'bg-navy-900 text-white' : 'text-navy-900 hover:bg-brand-50'
                  }`}
                  onClick={() => setSelected(r.Id)}
                >
                  <span className="font-semibold">{r.Name}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                      selected === r.Id ? 'bg-white/15 text-white' : 'bg-mist text-navy-700'
                    }`}
                  >
                    {r.UserCount}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </Card>

        {!selected ? (
          <EmptyState title="Select a role" hint="Choose a role on the left to review its permissions." />
        ) : (
          <div className="space-y-4">
            {modules.map((mod) => (
              <Card key={mod}>
                <CardHeader title={mod} />
                <div className="grid gap-2 sm:grid-cols-2">
                  {(allPerms ?? [])
                    .filter((p) => p.Module === mod)
                    .map((p) => {
                      const on = current.has(p.Id);
                      return (
                        <label
                          key={p.Id}
                          className={`flex cursor-pointer items-center gap-2.5 rounded-xl border px-3 py-2.5 text-sm transition ${
                            on
                              ? 'border-brand-400/35 bg-brand-50 text-navy-900'
                              : 'border-navy-800/10 bg-white/60 text-navy-800/70 hover:bg-mist/50'
                          }`}
                        >
                          <input
                            type="checkbox"
                            className="h-4 w-4 rounded border-navy-800/25 text-brand-500 accent-brand-500"
                            checked={on}
                            onChange={(e) => {
                              const next = new Set(current);
                              if (e.target.checked) next.add(p.Id);
                              else next.delete(p.Id);
                              dispatch(saveRolePermissionsStart({ id: selected, permissionIds: [...next] }));
                            }}
                          />
                          <span className="min-w-0">
                            <span className="block font-medium">{p.Name}</span>
                            <span className="block truncate text-xs text-navy-800/45">{p.Code}</span>
                          </span>
                        </label>
                      );
                    })}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
export default RolesPage;