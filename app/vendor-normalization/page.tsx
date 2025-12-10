"use client";

import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useState } from "react";
import Papa from "papaparse";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

// Prosera Standard Schema
// Required fields that must always be mapped
const REQUIRED_FIELDS = [
  { field: "sku", label: "SKU/Product ID" },
  { field: "product_name", label: "Product Name" },
  { field: "unit_price", label: "Unit Price" },
  { field: "date", label: "Date" },
];

export default function VendorNormalizationPage() {
  const [fileName, setFileName] = useState("");
  const [rawData, setRawData] = useState<any[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [requiredMappings, setRequiredMappings] = useState<Record<string, string>>({});
  const [selectedOptionalFields, setSelectedOptionalFields] = useState<string[]>([]);
  const [chartType, setChartType] = useState<"bar" | "line" | "pie">("bar");
  const [xAxisField, setXAxisField] = useState("");
  const [yAxisField, setYAxisField] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      
      Papa.parse(file, {
        header: true,
        complete: (results) => {
          setRawData(results.data);
          if (results.data.length > 0) {
            const cols = Object.keys(results.data[0]);
            setColumns(cols);
            
            // Auto-detect required field mappings
            const autoMappings: Record<string, string> = {};
            REQUIRED_FIELDS.forEach((reqField) => {
              const match = cols.find((col) => 
                col.toLowerCase().includes(reqField.field.toLowerCase()) ||
                (reqField.field === "date" && col.toLowerCase().includes("transaction"))
              );
              if (match) {
                autoMappings[reqField.field] = match;
              }
            });
            setRequiredMappings(autoMappings);
            
            // Auto-select some common optional fields
            const commonFields = cols.filter(col => 
              !Object.values(autoMappings).includes(col)
            );
            setSelectedOptionalFields([]);
          }
        },
      });
    }
  };
  const handleRequiredMappingChange = (requiredField: string, vendorColumn: string) => {
    setRequiredMappings({ ...requiredMappings, [requiredField]: vendorColumn });
  };

  const handleOptionalFieldToggle = (field: string) => {
    if (selectedOptionalFields.includes(field)) {
      setSelectedOptionalFields(selectedOptionalFields.filter(f => f !== field));
    } else {
      setSelectedOptionalFields([...selectedOptionalFields, field]);
    }
  };

  const handleSelectAllOptional = () => {
    setSelectedOptionalFields(getOptionalFields());
  };

  const handleSelectNoneOptional = () => {
    setSelectedOptionalFields([]);
  };

  const handleMappingChange = (standardField: string, vendorColumn: string) => {
    setMappings({ ...mappings, [standardField]: vendorColumn });
  };

  const getMissingRequired = () => {
    return REQUIRED_FIELDS.filter(
      (field) => !requiredMappings[field.field]
    );
  };

  const normalizeData = () => {
    return rawData.map((row) => {
      const normalized: any = {};
      
      // Add required fields
      REQUIRED_FIELDS.forEach((field) => {
        const vendorCol = requiredMappings[field.field];
        normalized[field.field] = vendorCol ? row[vendorCol] : "";
      });
      
      // Add selected optional fields
      selectedOptionalFields.forEach((field) => {
        normalized[field] = row[field] || "";
      });
      
      return normalized;
    });
  };

  const handleExport = () => {
    const normalized = normalizeData();
    const csv = Papa.unparse(normalized);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `prosera_normalized_${fileName}`;
    link.click();
  };

  const canNormalize = getMissingRequired().length === 0;

  const getOptionalFields = () => {
    const requiredColumnValues = Object.values(requiredMappings);
    return columns.filter(col => !requiredColumnValues.includes(col));
  };

  const getNumericFields = () => {
    if (rawData.length === 0) return [];
    const allFields = [...REQUIRED_FIELDS.map(f => f.field), ...selectedOptionalFields];
    return allFields.filter(field => {
      const sampleValue = normalizeData()[0]?.[field];
      return !isNaN(parseFloat(sampleValue));
    });
  };

  const getCategoryFields = () => {
    if (rawData.length === 0) return [];
    const allFields = [...REQUIRED_FIELDS.map(f => f.field), ...selectedOptionalFields];
    return allFields.filter(field => {
      const sampleValue = normalizeData()[0]?.[field];
      return isNaN(parseFloat(sampleValue));
    });
  };

  const getChartData = () => {
    if (!xAxisField || !yAxisField) return [];
    
    const normalized = normalizeData();
    
    // Group by X-axis field and aggregate Y-axis values
    const grouped: Record<string, number> = {};
    
    normalized.forEach(row => {
      const xValue = row[xAxisField] || "Unknown";
      const yValue = parseFloat(row[yAxisField]) || 0;
      
      if (!grouped[xValue]) {
        grouped[xValue] = 0;
      }
      grouped[xValue] += yValue;
    });
    
    // Convert to array format for charts
    return Object.entries(grouped).map(([key, value]) => ({
      name: key,
      value: value,
    })).slice(0, 10); // Limit to top 10 for readability
  };

  const CHART_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#FF6B6B', '#4ECDC4', '#45B7D1'];

  return (
    <div className="container mx-auto p-8 max-w-6xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">
          Heartland - Inbound Vendor Normalization
        </h1>
        <p className="text-gray-600">
          Upload vendor files and normalize them to Prosera standard schema
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Step 1: Upload Vendor File</CardTitle>
          <CardDescription>
            Upload a CSV file from your vendor
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="max-w-md"
            />
            {fileName && (
              <span className="text-sm text-gray-600">
                Loaded: {fileName}
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      {rawData.length > 0 && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Raw Data Preview</CardTitle>
              <CardDescription>
                Showing first 5 rows from vendor file
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {columns.map((col) => (
                        <TableHead key={col}>{col}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rawData.slice(0, 5).map((row, idx) => (
                      <TableRow key={idx}>
                        {columns.map((col) => (
                          <TableCell key={col}>{row[col]}</TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Step 2: Map Required Fields & Select Optional Fields</CardTitle>
              <CardDescription>
                Map the required fields, then select which additional fields to include
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Required Fields Section */}
              <div>
                <h3 className="font-semibold mb-3">Required Fields</h3>
                <div className="space-y-4">
                  {REQUIRED_FIELDS.map((reqField) => (
                    <div key={reqField.field} className="flex items-center gap-4">
                      <div className="w-48">
                        <div className="font-medium">{reqField.label}</div>
                        <Badge variant="destructive" className="text-xs">Required</Badge>
                      </div>
                      <div className="flex-1">
                        <Select
                          value={requiredMappings[reqField.field] || ""}
                          onValueChange={(value) =>
                            handleRequiredMappingChange(reqField.field, value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select vendor column..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="__none__">-- None --</SelectItem>
                            {columns.map((col) => (
                              <SelectItem key={col} value={col}>
                                {col}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Optional Fields Section */}
              <div className="border-t pt-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">Optional Fields (Select which to include)</h3>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleSelectAllOptional}
                    >
                      Select All
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleSelectNoneOptional}
                    >
                      Select None
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {getOptionalFields().map((field) => (
                    <div key={field} className="flex items-center gap-2 p-2 border rounded">
                      <input
                        type="checkbox"
                        checked={selectedOptionalFields.includes(field)}
                        onChange={() => handleOptionalFieldToggle(field)}
                        className="h-4 w-4"
                        id={`field-${field}`}
                      />
                      <label htmlFor={`field-${field}`} className="text-sm cursor-pointer flex-1">
                        {field}
                      </label>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-600 mt-3">
                  {selectedOptionalFields.length} optional field(s) selected
                </p>
              </div>
            </CardContent>
          </Card>

          {canNormalize && (
            <Card>
              <CardHeader>
                <CardTitle>Step 3: Preview & Export Normalized Data</CardTitle>
                <CardDescription>
                  Review normalized data and download
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {REQUIRED_FIELDS.map((field) => (
                          <TableHead key={field.field}>{field.label}</TableHead>
                        ))}
                        {selectedOptionalFields.map((field) => (
                          <TableHead key={field}>{field}</TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {normalizeData().slice(0, 5).map((row, idx) => (
                        <TableRow key={idx}>
                          {REQUIRED_FIELDS.map((field) => (
                            <TableCell key={field.field}>
                              {row[field.field]}
                            </TableCell>
                          ))}
                          {selectedOptionalFields.map((field) => (
                            <TableCell key={field}>
                              {row[field]}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <div className="flex justify-between items-center pt-4 border-t">
                  <p className="text-sm text-gray-600">
                    {rawData.length} rows will be exported with {REQUIRED_FIELDS.length + selectedOptionalFields.length} fields
                  </p>
                  <Button onClick={handleExport}>
                    <Download className="mr-2 h-4 w-4" />
                    Download Normalized CSV
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        {canNormalize && normalizeData().length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Step 4: Visualize Data</CardTitle>
                <CardDescription>
                  Create charts to visualize your normalized data
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Chart Configuration */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Chart Type</label>
                    <Select value={chartType} onValueChange={(value: any) => setChartType(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bar">Bar Chart</SelectItem>
                        <SelectItem value="line">Line Chart</SelectItem>
                        <SelectItem value="pie">Pie Chart</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      X-Axis (Category/Date)
                    </label>
                    <Select value={xAxisField} onValueChange={setXAxisField}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select field..." />
                      </SelectTrigger>
                      <SelectContent>
                        {getCategoryFields().map((field) => (
                          <SelectItem key={field} value={field}>
                            {field}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Y-Axis (Numeric)
                    </label>
                    <Select value={yAxisField} onValueChange={setYAxisField}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select field..." />
                      </SelectTrigger>
                      <SelectContent>
                        {getNumericFields().map((field) => (
                          <SelectItem key={field} value={field}>
                            {field}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Chart Display */}
                {xAxisField && yAxisField && getChartData().length > 0 && (
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <h3 className="text-lg font-semibold mb-4 text-center">
                      {yAxisField} by {xAxisField} (Top 10)
                    </h3>
                    <ResponsiveContainer width="100%" height={400}>
                      {chartType === "bar" && (
                        <BarChart data={getChartData()}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="value" fill="#0088FE" name={yAxisField} />
                        </BarChart>
                      )}
                      
                      {chartType === "line" && (
                        <LineChart data={getChartData()}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line type="monotone" dataKey="value" stroke="#0088FE" name={yAxisField} />
                        </LineChart>
                      )}
                      
                      {chartType === "pie" && (
                        <PieChart>
                          <Pie
                            data={getChartData()}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={120}
                            label={(entry) => entry.name}
                          >
                            {getChartData().map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      )}
                    </ResponsiveContainer>
                  </div>
                )}
                
                {xAxisField && yAxisField && getChartData().length === 0 && (
                  <div className="text-center text-gray-500 py-8">
                    No data available for the selected fields
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}