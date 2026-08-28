// AUTHOR : NANDNHAKUMAR SV 
// DATE : 28/08/2026
// DESCRIPTION : Hall detail page to view hall detail
import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ExternalLink, Pencil } from 'lucide-react';
import type { Hall } from '../../types/api';
import { PageHeader, Spinner, StatusBadge } from '../../components/ui/Feedback';
import { GhostButton } from '../../components/ui/Form';
import { Card, CardHeader, DefinitionItem } from '../../components/ui/Surface';
import { usePermission } from '../../hooks/usePermission';
import { useAppDispatch, useAppSelector } from '../../store';
import { fetchHallStart } from '../../redux/halls/halls.action';
import { selectHall, selectHallLoading } from '../../redux/halls/halls.selector';

export function HallDetailPage() {

  /******* STATE *******/
  const { id } = useParams();
  const { can } = usePermission();
  const dispatch = useAppDispatch();

  /******* SELECTORS *******/
  const data = useAppSelector(selectHall) as Hall | null;
  const isLoading = useAppSelector(selectHallLoading);

  /******* EFFECTS *******/
  useEffect(() => {
    if (id) dispatch(fetchHallStart({ id }));
  }, [id, dispatch]);
  if (isLoading || !data) return <Spinner />;


  
  return (
    <div>
      <PageHeader
        title={data.Name}
        description={`${data.Code} · ${data.Building} · Floor ${data.Floor}`}
        actions={
          <div className="flex flex-wrap gap-2">
            <Link to={`/display/${data.Code}`} target="_blank">
              <GhostButton type="button">
                <ExternalLink className="h-4 w-4" />
                Open display
              </GhostButton>
            </Link>
            {can('halls.update') ? (
              <Link to={`/halls/${data.Id}/edit`}>
                <GhostButton type="button">
                  <Pencil className="h-4 w-4" />
                  Edit
                </GhostButton>
              </Link>
            ) : null}
          </div>
        }
      />
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader title="Overview" subtitle={data.Description || undefined} />
          <dl className="grid grid-cols-2 gap-2.5">
            <DefinitionItem label="Capacity" value={`${data.Capacity} people`} />
            <DefinitionItem label="Type" value={data.HallType} />
            <DefinitionItem
              label="Hours"
              value={`${String(data.OpeningTime).slice(0, 5)} – ${String(data.ClosingTime).slice(0, 5)}`}
            />
            <DefinitionItem label="Status" value={<StatusBadge value={data.Status} />} />
          </dl>
        </Card>
        <Card>
          <CardHeader title="Facilities" />
          {!data.facilities?.length ? (
            <p className="text-sm text-navy-800/50">No facilities listed.</p>
          ) : (
            <ul className="flex flex-wrap gap-2">
              {data.facilities.map((f) => (
                <li
                  key={f.Id}
                  className="rounded-full border border-navy-800/10 bg-mist/60 px-3 py-1.5 text-xs font-semibold text-navy-700"
                >
                  {f.Name}
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
export default HallDetailPage;