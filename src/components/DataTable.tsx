import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Database } from 'lucide-react';
import { formatTimestamp } from '@/lib/utils';
import { Button } from '@/components/ui/button';

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

interface DataTableProps {
  data: IoTData[];
}

export function DataTable({ data }: DataTableProps) {
  if (data.length === 0) return null;

  // États pour les filtres
  const [filters, setFilters] = useState<Record<string, any>>({
    bulb1: null,
    bulb2: null,
    bulb3: null,
    bulb4: null,
    indicateur1: null,
    indicateur2: null,
    indicateur3: null,
    indicateur4: null,
  });

  // Afficher les 50 dernières entrées
  const displayData = data.slice(-50).reverse();

  // Fonction pour formater les valeurs
  const formatValue = (value: any) => {
    if (typeof value === 'boolean') {
      return value ? 'True' : 'False';
    }
    if (value === 'Not Available') {
      return 'N/A';
    }
    return String(value);
  };

  // Fonction pour déterminer la classe CSS d'une cellule
  const getCellClassName = (value: any) => {
    if (typeof value === 'boolean') {
      return value ? 'text-green-400' : 'text-red-400';
    }
    if (value === 'Not Available') {
      return 'text-gray-400';
    }
    if (typeof value === 'number') {
      return 'text-blue-400 font-mono';
    }
    return '';
  };

  // Fonction pour appliquer les filtres
  const applyFilters = (row: IoTData) => {
    return Object.entries(filters).every(([key, value]) => {
      if (value === null) return true;
      if (key.startsWith('bulb') || key.startsWith('ecran')) {
        return row[key as keyof IoTData] === value;
      } else if (key.startsWith('indicateur')) {
        return row[key as keyof IoTData] === value;
      }
      return true;
    });
  };

  // Fonction pour basculer un filtre
  const toggleFilter = (key: string, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: prev[key] === value ? null : value,
    }));
  };

  // Fonction pour réinitialiser tous les filtres
  const resetFilters = () => {
    setFilters({
      bulb1: null,
      bulb2: null,
      bulb3: null,
      bulb4: null,
      indicateur1: null,
      indicateur2: null,
      indicateur3: null,
      indicateur4: null,
    });
  };

  // Vérifie si au moins un filtre est actif
  const isFilterActive = Object.values(filters).some((value) => value !== null);

  return (
    <Card className="glass-card animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5 text-primary" />
          Raw Data (Last 50 entries)
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Boutons de filtre */}
        <div className="flex gap-2 mb-4 flex-wrap">
          <Button
            variant={filters.bulb1 === true ? "default" : "outline"}
            size="sm"
            onClick={() => toggleFilter('bulb1', true)}
          >
            Bulb 1: ON
          </Button>
          <Button
            variant={filters.bulb1 === false ? "default" : "outline"}
            size="sm"
            onClick={() => toggleFilter('bulb1', false)}
          >
            Bulb 1: OFF
          </Button>
          <Button
            variant={filters.bulb2 === true ? "default" : "outline"}
            size="sm"
            onClick={() => toggleFilter('bulb2', true)}
          >
            Bulb 2: ON
          </Button>
          <Button
            variant={filters.bulb2 === false ? "default" : "outline"}
            size="sm"
            onClick={() => toggleFilter('bulb2', false)}
          >
            Bulb 2: OFF
          </Button>
          <Button
            variant={filters.indicateur1 !== null ? "default" : "outline"}
            size="sm"
            onClick={() => toggleFilter('indicateur1', 10)}
          >
            Indicateur 1 > 10
          </Button>
          {isFilterActive && (
            <Button
              variant="destructive"
              size="sm"
              onClick={resetFilters}
            >
              Reset Filters
            </Button>
          )}
        </div>

        {/* Tableau des données */}
        <ScrollArea className="h-96">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[140px]">Timestamp</TableHead>
                <TableHead className="w-[120px]">Email</TableHead>
                <TableHead>B1</TableHead>
                <TableHead>B2</TableHead>
                <TableHead>B3</TableHead>
                <TableHead>B4</TableHead>
                <TableHead>E1</TableHead>
                <TableHead>E2</TableHead>
                <TableHead>E3</TableHead>
                <TableHead>E4</TableHead>
                <TableHead>E5</TableHead>
                <TableHead>E6</TableHead>
                <TableHead>I1</TableHead>
                <TableHead>I2</TableHead>
                <TableHead>I3</TableHead>
                <TableHead>I4</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayData
                .filter(applyFilters)
                .map((row, index) => (
                  <TableRow
                    key={index}
                    className={`hover:bg-muted/20 ${
                      isFilterActive ? 'bg-muted/10' : ''
                    }`}
                  >
                    <TableCell className="font-mono text-xs">
                      {formatTimestamp(row.timestamp)}
                    </TableCell>
                    <TableCell className="text-xs truncate max-w-[120px]">
                      {row.email}
                    </TableCell>
                    <TableCell className={`text-xs ${getCellClassName(row.bulb1)}`}>
                      {formatValue(row.bulb1)}
                    </TableCell>
                    <TableCell className={`text-xs ${getCellClassName(row.bulb2)}`}>
                      {formatValue(row.bulb2)}
                    </TableCell>
                    <TableCell className={`text-xs ${getCellClassName(row.bulb3)}`}>
                      {formatValue(row.bulb3)}
                    </TableCell>
                    <TableCell className={`text-xs ${getCellClassName(row.bulb4)}`}>
                      {formatValue(row.bulb4)}
                    </TableCell>
                    <TableCell className={`text-xs ${getCellClassName(row.ecran1)}`}>
                      {formatValue(row.ecran1)}
                    </TableCell>
                    <TableCell className={`text-xs ${getCellClassName(row.ecran2)}`}>
                      {formatValue(row.ecran2)}
                    </TableCell>
                    <TableCell className={`text-xs ${getCellClassName(row.ecran3)}`}>
                      {formatValue(row.ecran3)}
                    </TableCell>
                    <TableCell className={`text-xs ${getCellClassName(row.ecran4)}`}>
                      {formatValue(row.ecran4)}
                    </TableCell>
                    <TableCell className={`text-xs ${getCellClassName(row.ecran5)}`}>
                      {formatValue(row.ecran5)}
                    </TableCell>
                    <TableCell className={`text-xs ${getCellClassName(row.ecran6)}`}>
                      {formatValue(row.ecran6)}
                    </TableCell>
                    <TableCell className={`text-xs ${getCellClassName(row.indicateur1)}`}>
                      {formatValue(row.indicateur1)}
                    </TableCell>
                    <TableCell className={`text-xs ${getCellClassName(row.indicateur2)}`}>
                      {formatValue(row.indicateur2)}
                    </TableCell>
                    <TableCell className={`text-xs ${getCellClassName(row.indicateur3)}`}>
                      {formatValue(row.indicateur3)}
                    </TableCell>
                    <TableCell className={`text-xs ${getCellClassName(row.indicateur4)}`}>
                      {formatValue(row.indicateur4)}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
