import { Task, TaskTrigger, TaskContent, TaskItem } from '../ai-elements';
import { Checkpoint, CheckpointIcon, CheckpointTrigger } from '../ai-elements';

export const CollaborationHub = () => (
  <div className="space-y-4">
    <div className="text-sm text-muted-foreground">Discuss project...</div>
    <Task>
      <TaskTrigger title="Review analysis" />
      <TaskContent>
        <TaskItem>Status: pending</TaskItem>
      </TaskContent>
    </Task>
    <Checkpoint>
      <CheckpointIcon />
      <CheckpointTrigger tooltip="Phase Gate 1" />
    </Checkpoint>
  </div>
);
