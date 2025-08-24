import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Database, Copy, CheckCircle, AlertCircle, Loader2, Plus, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Project {
  id: string;
  name: string;
  url: string;
  csvUrl: string;
}

interface ConnectionPanelProps {
  onConnect: (csvUrl: string, projectName: string) => void;
  isLoading: boolean;
  error: string | null;
  currentProject?: Project;
}

export function ConnectionPanel({ onConnect, isLoading, error, currentProject }: ConnectionPanelProps) {
  const [projectName, setProjectName] = useState('');
  const [sheetUrl, setSheetUrl] = useState('');
  const [csvUrl, setCsvUrl] = useState('');
  const [savedProjects, setSavedProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [isNewProject, setIsNewProject] = useState(true);
  const { toast } = useToast();

  // Load saved projects from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('iot-dashboard-projects');
    if (saved) {
      const projects: Project[] = JSON.parse(saved);
      setSavedProjects(projects);
    }
  }, []);

  // Set current project data when currentProject changes
  useEffect(() => {
    if (currentProject) {
      setProjectName(currentProject.name);
      setSheetUrl(currentProject.url);
      setCsvUrl(currentProject.csvUrl);
      setSelectedProjectId(currentProject.id);
      setIsNewProject(false);
    }
  }, [currentProject]);

  const convertToCSVUrl = (url: string): string => {
    try {
      const match = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
      if (!match) throw new Error('Invalid Google Sheets URL');
      
      const sheetId = match[1];
      return `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`;
    } catch {
      throw new Error('Please enter a valid Google Sheets URL');
    }
  };

  const saveProject = (project: Project) => {
    const updatedProjects = savedProjects.filter(p => p.id !== project.id);
    updatedProjects.push(project);
    setSavedProjects(updatedProjects);
    localStorage.setItem('iot-dashboard-projects', JSON.stringify(updatedProjects));
    localStorage.setItem('iot-dashboard-last-project', project.id);
  };

  const deleteProject = (projectId: string) => {
    const updatedProjects = savedProjects.filter(p => p.id !== projectId);
    setSavedProjects(updatedProjects);
    localStorage.setItem('iot-dashboard-projects', JSON.stringify(updatedProjects));
    
    if (selectedProjectId === projectId) {
      setSelectedProjectId('');
      setIsNewProject(true);
      setProjectName('');
      setSheetUrl('');
      setCsvUrl('');
    }
    
    toast({
      title: "Project Deleted",
      description: "Project has been removed from saved projects",
    });
  };

  const selectProject = (projectId: string) => {
    const project = savedProjects.find(p => p.id === projectId);
    if (project) {
      setSelectedProjectId(projectId);
      setProjectName(project.name);
      setSheetUrl(project.url);
      setCsvUrl(project.csvUrl);
      setIsNewProject(false);
      onConnect(project.csvUrl, project.name);
    }
  };

  const handleConnect = () => {
    if (!projectName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a project name",
        variant: "destructive"
      });
      return;
    }

    if (!sheetUrl.trim()) {
      toast({
        title: "Error",
        description: "Please enter a Google Sheets URL",
        variant: "destructive"
      });
      return;
    }

    try {
      const csvUrl = convertToCSVUrl(sheetUrl);
      setCsvUrl(csvUrl);
      
      const project: Project = {
        id: selectedProjectId || Date.now().toString(),
        name: projectName.trim(),
        url: sheetUrl.trim(),
        csvUrl
      };
      
      saveProject(project);
      setSelectedProjectId(project.id);
      setIsNewProject(false);
      onConnect(csvUrl, projectName.trim());
      
      toast({
        title: "Project Saved",
        description: `"${projectName}" has been saved and connected`,
      });
    } catch (error) {
      toast({
        title: "Invalid URL",
        description: error instanceof Error ? error.message : "Invalid Google Sheets URL",
        variant: "destructive"
      });
    }
  };

  const handleNewProject = () => {
    setIsNewProject(true);
    setSelectedProjectId('');
    setProjectName('');
    setSheetUrl('');
    setCsvUrl('');
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(csvUrl);
      toast({
        title: "Copied!",
        description: "CSV URL copied to clipboard",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to copy URL",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="glass-card animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5 text-primary" />
          Project Management
        </CardTitle>
        <CardDescription>
          Save and manage your IoT dashboard projects
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Saved Projects Dropdown */}
        {savedProjects.length > 0 && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Saved Projects</label>
            <div className="flex gap-2">
              <Select value={selectedProjectId} onValueChange={selectProject}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select a project..." />
                </SelectTrigger>
                <SelectContent>
                  {savedProjects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" onClick={handleNewProject}>
                <Plus className="h-4 w-4" />
              </Button>
              {selectedProjectId && (
                <Button variant="destructive" size="sm" onClick={() => deleteProject(selectedProjectId)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Project Name Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Project Name</label>
          <Input
            placeholder="My IoT Project"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            disabled={isLoading}
          />
        </div>

        {/* Google Sheets URL Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Google Sheets URL</label>
          <div className="flex gap-2">
            <Input
              placeholder="https://docs.google.com/spreadsheets/d/..."
              value={sheetUrl}
              onChange={(e) => setSheetUrl(e.target.value)}
              className="flex-1"
              disabled={isLoading}
            />
            <Button 
              onClick={handleConnect} 
              disabled={isLoading || !sheetUrl.trim() || !projectName.trim()}
              className="glow-primary"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                isNewProject ? 'Connect' : 'Update'
              )}
            </Button>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-destructive text-sm animate-scale-in">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        )}

        {csvUrl && (
          <div className="space-y-2 animate-scale-in">
            <div className="flex items-center gap-2 text-green-400 text-sm">
              <CheckCircle className="h-4 w-4" />
              Connected successfully
            </div>
            <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
              <code className="flex-1 text-xs text-muted-foreground truncate">
                {csvUrl}
              </code>
              <Button size="sm" variant="ghost" onClick={copyToClipboard}>
                <Copy className="h-3 w-3" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}