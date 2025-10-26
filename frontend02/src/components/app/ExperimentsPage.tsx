import { Plus, Play, CheckCircle, AlertCircle } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';

export function ExperimentsPage() {
  const experiments = [
    {
      name: 'Pricing Page Redesign',
      status: 'running',
      variant: 'B',
      lift: '+12.4%',
      confidence: 95,
      users: 8400,
      guardrail: 'pass',
    },
    {
      name: 'Onboarding Flow v3',
      status: 'draft',
      variant: null,
      lift: null,
      confidence: null,
      users: 0,
      guardrail: null,
    },
    {
      name: 'Email Cadence Test',
      status: 'completed',
      variant: 'A',
      lift: '+8.2%',
      confidence: 98,
      users: 12300,
      guardrail: 'pass',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Experiments</h1>
          <p className="text-muted-foreground mt-1">
            A/B tests and experiment tracking
          </p>
        </div>
        <Button className="gap-2 rounded-xl">
          <Plus className="h-4 w-4" />
          New Experiment
        </Button>
      </div>

      <div className="grid gap-6">
        {experiments.map((exp) => (
          <Card key={exp.name} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold">{exp.name}</h3>
                  <Badge
                    variant={
                      exp.status === 'running'
                        ? 'default'
                        : exp.status === 'completed'
                        ? 'secondary'
                        : 'outline'
                    }
                  >
                    {exp.status === 'running' && <Play className="h-3 w-3 mr-1" />}
                    {exp.status === 'completed' && <CheckCircle className="h-3 w-3 mr-1" />}
                    {exp.status}
                  </Badge>
                  {exp.guardrail === 'pass' && (
                    <Badge variant="secondary" className="bg-success/10 text-success">
                      Guardrails Pass
                    </Badge>
                  )}
                </div>
                {exp.users > 0 && (
                  <p className="text-sm text-muted-foreground">
                    {exp.users.toLocaleString()} users enrolled
                  </p>
                )}
              </div>

              {exp.lift && (
                <div className="text-right">
                  <div className="text-2xl font-bold text-success">{exp.lift}</div>
                  <div className="text-sm text-muted-foreground">
                    Variant {exp.variant}
                  </div>
                </div>
              )}
            </div>

            {exp.confidence !== null && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Statistical Confidence</span>
                  <span className="font-medium">{exp.confidence}%</span>
                </div>
                <Progress value={exp.confidence} className="h-2" />
              </div>
            )}

            <div className="mt-4 pt-4 border-t border-border flex gap-2">
              {exp.status === 'running' && (
                <>
                  <Button variant="outline" size="sm">View Details</Button>
                  <Button variant="ghost" size="sm" className="text-success">
                    Promote Winner
                  </Button>
                </>
              )}
              {exp.status === 'draft' && (
                <Button variant="outline" size="sm">
                  <Play className="h-4 w-4 mr-2" />
                  Start Experiment
                </Button>
              )}
              {exp.status === 'completed' && (
                <Button variant="outline" size="sm">View Report</Button>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
