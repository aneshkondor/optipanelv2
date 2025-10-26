import { useState } from 'react';
import { ArrowRight, ArrowLeft, Check, Database, Upload, Users, Sparkles } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';

interface OnboardingFlowProps {
  onComplete: () => void;
}

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [step, setStep] = useState(1);
  const [workspace, setWorkspace] = useState('');
  const [dataSource, setDataSource] = useState('');
  const [useSample, setUseSample] = useState(false);

  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

  const dataSourceOptions = [
    { value: 'csv', label: 'CSV Upload', icon: <Upload className="h-5 w-5" /> },
    { value: 'api', label: 'API Integration', icon: <Database className="h-5 w-5" /> },
    { value: 'database', label: 'Direct Database', icon: <Database className="h-5 w-5" /> },
    { value: 'sample', label: 'Sample Dataset', icon: <Sparkles className="h-5 w-5" /> },
  ];

  const roles = [
    { id: 'admin', name: 'Admin', description: 'Full access to all features' },
    { id: 'analyst', name: 'Analyst', description: 'View and create reports' },
    { id: 'viewer', name: 'Viewer', description: 'View-only access' },
  ];

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">
              Step {step} of {totalSteps}
            </span>
            <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <Card className="p-8">
          {/* Step 1: Create Workspace */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Create your workspace</h2>
                <p className="text-muted-foreground">
                  Give your workspace a name to get started
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="workspace">Workspace Name</Label>
                  <Input
                    id="workspace"
                    placeholder="e.g., Acme Corp Analytics"
                    value={workspace}
                    onChange={(e) => setWorkspace(e.target.value)}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="url">Workspace URL</Label>
                  <div className="flex items-center gap-2 mt-2">
                    <Input
                      id="url"
                      placeholder="acme-corp"
                      className="flex-1"
                    />
                    <span className="text-sm text-muted-foreground">.productname.com</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Connect Data */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Connect your data</h2>
                <p className="text-muted-foreground">
                  Choose how you'd like to import your data
                </p>
              </div>

              <RadioGroup value={dataSource} onValueChange={setDataSource}>
                <div className="space-y-3">
                  {dataSourceOptions.map((option) => (
                    <Card
                      key={option.value}
                      className={`p-4 cursor-pointer transition-all ${
                        dataSource === option.value
                          ? 'border-primary bg-primary/5'
                          : 'hover:border-primary/50'
                      }`}
                      onClick={() => setDataSource(option.value)}
                    >
                      <div className="flex items-center gap-4">
                        <RadioGroupItem value={option.value} id={option.value} />
                        <div className="flex items-center gap-3 flex-1">
                          <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                            {option.icon}
                          </div>
                          <div>
                            <div className="font-medium">{option.label}</div>
                            {option.value === 'sample' && (
                              <Badge variant="secondary" className="mt-1">
                                Recommended
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </RadioGroup>
            </div>
          )}

          {/* Step 3: Sample Dataset */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Sample dataset loaded</h2>
                <p className="text-muted-foreground">
                  We've loaded a sample B2B SaaS dataset so you can explore immediately
                </p>
              </div>

              <Card className="p-6 bg-muted/30">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Events</span>
                    <span className="font-semibold">2.4M</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Users</span>
                    <span className="font-semibold">45.2K</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Date Range</span>
                    <span className="font-semibold">Last 12 months</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Revenue Data</span>
                    <Badge variant="secondary">
                      <Check className="h-3 w-3 mr-1" />
                      Included
                    </Badge>
                  </div>
                </div>
              </Card>

              <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                <div className="flex gap-3">
                  <Sparkles className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium text-sm mb-1">Sample Data Features</div>
                    <p className="text-sm text-muted-foreground">
                      Full analytics capabilities including funnels, cohorts, revenue tracking, and experiments. Replace with your own data anytime.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Invite Team */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Invite your team</h2>
                <p className="text-muted-foreground">
                  Collaborate with Finance, Product, and Growth teams
                </p>
              </div>

              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex gap-3">
                    <Input placeholder="colleague@company.com" className="flex-1" />
                    <select className="px-3 py-2 border border-input rounded-lg bg-background text-sm">
                      <option>Admin</option>
                      <option>Analyst</option>
                      <option>Viewer</option>
                    </select>
                  </div>
                ))}
              </div>

              <div className="space-y-3 pt-4 border-t border-border">
                <div className="font-medium text-sm">Available Roles</div>
                {roles.map((role) => (
                  <div key={role.id} className="flex items-start gap-3">
                    <Users className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <div className="text-sm font-medium">{role.name}</div>
                      <div className="text-sm text-muted-foreground">{role.description}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-sm text-muted-foreground">
                You can skip this step and invite teammates later from settings.
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
            <Button
              variant="ghost"
              onClick={handleBack}
              disabled={step === 1}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>

            <Button
              onClick={handleNext}
              disabled={step === 1 && !workspace}
              className="rounded-xl"
            >
              {step === totalSteps ? 'Get Started' : 'Continue'}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </Card>

        {/* Skip Option */}
        {step > 2 && step < totalSteps && (
          <div className="text-center mt-4">
            <button
              onClick={onComplete}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Skip for now
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
