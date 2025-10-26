import { Plus, LayoutDashboard, Download, Share2 } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

export function ReportsPage() {
  const savedReports = [
    {
      name: 'Executive Summary',
      type: 'dashboard',
      updated: '2 hours ago',
      owner: 'John Doe',
      shared: true,
    },
    {
      name: 'Monthly Revenue Analysis',
      type: 'report',
      updated: '1 day ago',
      owner: 'Jane Smith',
      shared: false,
    },
    {
      name: 'Cohort Performance Q1',
      type: 'report',
      updated: '3 days ago',
      owner: 'Mike Johnson',
      shared: true,
    },
  ];

  const templates = [
    { name: 'Executive Dashboard', description: 'High-level KPIs and trends' },
    { name: 'Finance Report', description: 'Revenue, costs, and margins' },
    { name: 'Growth Metrics', description: 'Acquisition and activation' },
    { name: 'Product Analytics', description: 'Feature usage and engagement' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Reports Library</h1>
          <p className="text-muted-foreground mt-1">
            Saved dashboards and report templates
          </p>
        </div>
        <Button className="gap-2 rounded-xl">
          <Plus className="h-4 w-4" />
          New Report
        </Button>
      </div>

      <Tabs defaultValue="saved">
        <TabsList>
          <TabsTrigger value="saved">Saved Reports</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="saved" className="mt-6 space-y-4">
          {savedReports.map((report) => (
            <Card key={report.name} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                    <LayoutDashboard className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold">{report.name}</h4>
                      {report.shared && (
                        <Badge variant="secondary" className="text-xs">
                          Shared
                        </Badge>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      By {report.owner} • Updated {report.updated}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="ghost" size="icon">
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    Open
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="templates" className="mt-6">
          <div className="grid md:grid-cols-2 gap-4">
            {templates.map((template) => (
              <Card key={template.name} className="p-6">
                <h4 className="font-semibold mb-2">{template.name}</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  {template.description}
                </p>
                <Button variant="outline" size="sm">
                  Use Template
                </Button>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
