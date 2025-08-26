import { useState, useEffect, useMemo } from 'react';
import Papa from 'papaparse';
import { ConnectionPanel } from '@/components/ConnectionPanel';
import { StatusCards } from '@/components/StatusCards';
import { ChartSection } from '@/components/ChartSection';
import { DataTable } from '@/components/DataTable';
import { Database, RefreshCw, Calendar, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useToast } from '@/hooks/use-toast';
import { parseTimestamp, formatTimestamp } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface IoTData {
  timestamp: string;
  email: string;
  bulb1: string | boolean;
  bulb2: string | boolean;
  bulb3: string | boolean;
  bulb4: string | boolean;
  ecran1: string | boolean;
  ecran2: string | boolean;
  ecran3: string | boolean;
  ecran4: string | number;
  ecran5: string | boolean;
  ecran6: string | boolean;
  indicateur1: number;
  indicateur2: number;
  indicateur3: number;
  indicateur4: number;
}

const Index = () => {
  const [data, setData] = useState<IoTData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [csvUrl, setCsvUrl] = useState<string>('');
  const [currentProjectName, setCurrentProjectName] = useState<string>('');
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const { toast } = useToast();

  // Load last project from localStorage
  useEffect(() => {
    const lastProjectId = localStorage.getItem('iot-dashboard-last-project');
    const savedProjects = localStorage.getItem('iot-dashboard-projects');
    
    if (lastProjectId && savedProjects) {
      const projects = JSON.parse(savedProjects);
      const lastProject = projects.find((p: any) => p.id === lastProjectId);
      
      if (lastProject) {
        setCsvUrl(lastProject.csvUrl);
        setCurrentProjectName(lastProject.name);
        fetchData(lastProject.csvUrl);
      }
    }
  }, []);

  const fetchData = async (url: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const csvText = await response.text();
      
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        transform: (value: string, field: string) => {
          // Convert numeric fields
          if (field?.toLowerCase().includes('indicateur')) {
            const num = parseFloat(value);
            return isNaN(num) ? 0 : num;
          }
          
          // Convert boolean fields
          if (field?.toLowerCase().includes('bulb') || field?.toLowerCase().includes('ecran')) {
            if (value.toLowerCase() === 'true') return true;
            if (value.toLowerCase() === 'false') return false;
            return value;
          }
          
          return value;
        },
        complete: (results) => {
          if (results.errors.length > 0) {
            console.warn('Parse warnings:', results.errors);
          }
          
          const processedData = results.data.map((row: any) => ({
            timestamp: row.Timestamp || row.timestamp || '',
            email: row.Email || row.email || '',
            bulb1: row.Bulb1 || row.bulb1,
            bulb2: row.Bulb2 || row.bulb2,
            bulb3: row.Bulb3 || row.bulb3,
            bulb4: row.Bulb4 || row.bulb4,
            ecran1: row.Ecran1 || row.ecran1,
            ecran2: row.Ecran2 || row.ecran2,
            ecran3: row.Ecran3 || row.ecran3,
            ecran4: row.Ecran4 || row.ecran4,
            ecran5: row.Ecran5 || row.ecran5,
            ecran6: row.Ecran6 || row.ecran6,
            indicateur1: parseFloat(row.Indicateur1 || row.indicateur1 || '0'),
            indicateur2: parseFloat(row.Indicateur2 || row.indicateur2 || '0'),
            indicateur3: parseFloat(row.Indicateur3 || row.indicateur3 || '0'),
            indicateur4: parseFloat(row.Indicateur4 || row.indicateur4 || '0'),
          })).filter(row => row.timestamp); // Filter out empty rows
          
          setData(processedData);
          setLastUpdated(new Date());
          
          toast({
            title: "Data Updated",
            description: `Loaded ${processedData.length} records`,
          });
        },
        error: (error) => {
          throw new Error(`Parse error: ${error.message}`);
        }
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch data';
      setError(errorMessage);
      toast({
        title: "Connection Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnect = (url: string, projectName: string) => {
    setCsvUrl(url);
    setCurrentProjectName(projectName);
    fetchData(url);
  };

  const handleRefresh = () => {
    if (csvUrl) {
      fetchData(csvUrl);
    }
  };

  // Filter data by selected date
  const filteredData = useMemo(() => {
    if (!selectedDate || data.length === 0) return data;
    
    const selectedDateStr = selectedDate.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
    
    return data.filter(row => {
      if (!row.timestamp) return false;
      const rowDate = parseTimestamp(row.timestamp);
      const rowDateStr = rowDate.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit', 
        year: 'numeric'
      });
      return rowDateStr === selectedDateStr;
    });
  }, [data, selectedDate]);

  // Get available dates for the date picker
  const availableDates = useMemo(() => {
    if (data.length === 0) return [];
    const dates = data.map(row => {
      const date = parseTimestamp(row.timestamp);
      return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    });
    return Array.from(new Set(dates.map(d => d.getTime()))).map(time => new Date(time));
  }, [data]);

  // Set default date to latest available when data changes
  useEffect(() => {
    if (availableDates.length > 0 && !selectedDate) {
      const latestDate = new Date(Math.max(...availableDates.map(d => d.getTime())));
      setSelectedDate(latestDate);
    }
  }, [availableDates, selectedDate]);

  const handleClearFilter = () => {
    setSelectedDate(undefined);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/30 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/20 rounded-lg">
                <Database className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">IoT Dashboard</h1>
                <p className="text-sm text-muted-foreground">
                  {currentProjectName ? currentProjectName : 'Google Sheets Integration'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {lastUpdated && (
                <span className="text-xs text-muted-foreground">
                  Last updated: {lastUpdated.toLocaleTimeString()}
                </span>
              )}
              {csvUrl && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefresh}
                  disabled={isLoading}
                  className="gap-2"
                >
                  <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Connection Panel */}
        <ConnectionPanel 
          onConnect={handleConnect}
          isLoading={isLoading}
          error={error}
        />

        {/* Date Filter Section */}
        {data.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-card/50 p-4 rounded-lg border border-border/50">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Filter by Date:</span>
              </div>
              
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-[200px] justify-start text-left font-normal",
                      !selectedDate && "text-muted-foreground"
                    )}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {selectedDate ? (
                      selectedDate.toLocaleDateString('fr-FR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                      })
                    ) : (
                      <span>All dates</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => {
                      if (availableDates.length === 0) return false;
                      return !availableDates.some(availableDate => 
                        availableDate.toDateString() === date.toDateString()
                      );
                    }}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>

              {selectedDate && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearFilter}
                  className="gap-2"
                >
                  <X className="h-4 w-4" />
                  Clear Filter
                </Button>
              )}
            </div>

            <div className="text-sm text-muted-foreground">
              {selectedDate ? (
                filteredData.length > 0 ? (
                  `${filteredData.length} records for ${selectedDate.toLocaleDateString('fr-FR')}`
                ) : (
                  "No data available for this date"
                )
              ) : (
                `${data.length} total records`
              )}
            </div>
          </div>
        )}

        {/* Dashboard Content */}
        {data.length > 0 && (
          <>
            {filteredData.length > 0 ? (
              <>
                {/* Status Cards */}
                <StatusCards data={filteredData} />
                
                {/* Charts */}
                <ChartSection data={filteredData} />
                
                {/* Data Table */}
                <DataTable data={filteredData} />
              </>
            ) : selectedDate ? (
              <div className="text-center py-16 animate-fade-in">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No Data Available</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  No data found for {selectedDate.toLocaleDateString('fr-FR')}. 
                  Try selecting a different date or clear the filter to see all data.
                </p>
              </div>
            ) : null}
          </>
        )}

        {/* Empty State */}
        {data.length === 0 && !isLoading && (
          <div className="text-center py-16 animate-fade-in">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Database className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No Data Connected</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Connect to your Google Sheets to start monitoring your IoT devices. 
              Make sure your sheet is shared publicly and follows the expected format.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
