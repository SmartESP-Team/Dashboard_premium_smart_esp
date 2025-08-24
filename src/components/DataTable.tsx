import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Database } from 'lucide-react';
import { formatTimestamp } from '@/lib/utils';

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

  // Show last 50 entries
  const displayData = data.slice(-50).reverse();

  const formatValue = (value: any) => {
    if (typeof value === 'boolean') {
      return value ? 'True' : 'False';
    }
    if (value === 'Not Available') {
      return 'N/A';
    }
    return String(value);
  };

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

  return (
    <Card className="glass-card animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5 text-primary" />
          Raw Data (Last 50 entries)
        </CardTitle>
      </CardHeader>
      <CardContent>
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
              {displayData.map((row, index) => (
                <TableRow key={index} className="hover:bg-muted/20">
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