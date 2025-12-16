
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Textarea } from '../../../components/ui/textarea';
import { TrendingUp, FileText, Calculator, PieChart } from 'lucide-react';

interface AgentFeatures {
  features: string[];
  compliance: string[];
}

export default function CompensationBenefitsPage() {
  const [features, setFeatures] = useState<AgentFeatures | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('benchmark');
  const [benchmarkData, setBenchmarkData] = useState({
    position: '',
    location: '',
    experience_years: '',
    education_level: '',
    industry: '',
    company_size: ''
  });
  const [zakatData, setZakatData] = useState({
    employee_id: '',
    annual_salary: '',
    additional_income: '',
    zakat_year: '',
    marital_status: '',
    dependents: ''
  });
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  useEffect(() => {
    fetchFeatures();
  }, []);

  const fetchFeatures = async () => {
    try {
      const response = await fetch('/api/agents/compensation-benefits');
      const data = await response.json();
      setFeatures(data);
    } catch (error) {
      console.error('Failed to fetch features:', error);
    } finally {
      setLoading(false);
    }
  };

  const benchmarkSalary = async () => {
    if (!benchmarkData.position.trim()) return;

    setAnalyzing(true);
    try {
      const response = await fetch('/api/agents/coordinate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task: 'benchmark_salary',
          module: 'compensation-benefits',
          data: {
            ...benchmarkData,
            experience_years: parseInt(benchmarkData.experience_years),
            company_size: parseInt(benchmarkData.company_size)
          }
        })
      });
      const result = await response.json();
      setAnalysisResult(result);
    } catch (error) {
      console.error('Failed to benchmark salary:', error);
    } finally {
      setAnalyzing(false);
    }
  };

  const calculateZakat = async () => {
    if (!zakatData.employee_id.trim()) return;

    setAnalyzing(true);
    try {
      const response = await fetch('/api/agents/coordinate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task: 'calculate_zakat',
          module: 'compensation-benefits',
          data: {
            ...zakatData,
            annual_salary: parseFloat(zakatData.annual_salary),
            additional_income: parseFloat(zakatData.additional_income || '0'),
            dependents: parseInt(zakatData.dependents || '0')
          }
        })
      });
      const result = await response.json();
      setAnalysisResult(result);
    } catch (error) {
      console.error('Failed to calculate zakat:', error);
    } finally {
      setAnalyzing(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3">
        <TrendingUp className="h-8 w-8 text-purple-600" />
        <div>
          <h1 className="text-3xl font-bold">Compensation & Benefits Agent</h1>
          <p className="text-muted-foreground">AI-powered salary benchmarking, Zakat calculations, and pay equity analysis</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Key Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {features?.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Compliance Framework
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {features?.compliance.map((item, index) => (
                <Badge key={index} variant="secondary" className="mr-2 mb-2">
                  {item}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>AI Analysis Tools</CardTitle>
          <CardDescription>
            Select an analysis tool to process compensation and benefits data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <Button
              variant={activeTab === 'benchmark' ? 'default' : 'outline'}
              onClick={() => setActiveTab('benchmark')}
            >
              <PieChart className="h-4 w-4 mr-2" />
              Salary Benchmarking
            </Button>
            <Button
              variant={activeTab === 'zakat' ? 'default' : 'outline'}
              onClick={() => setActiveTab('zakat')}
            >
              <Calculator className="h-4 w-4 mr-2" />
              Zakat Calculation
            </Button>
          </div>

          {activeTab === 'benchmark' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder="Position/Job Title"
                  value={benchmarkData.position}
                  onChange={(e) => setBenchmarkData({...benchmarkData, position: e.target.value})}
                />
                <Input
                  placeholder="Location"
                  value={benchmarkData.location}
                  onChange={(e) => setBenchmarkData({...benchmarkData, location: e.target.value})}
                />
                <Input
                  placeholder="Experience (years)"
                  value={benchmarkData.experience_years}
                  onChange={(e) => setBenchmarkData({...benchmarkData, experience_years: e.target.value})}
                />
                <Input
                  placeholder="Education Level"
                  value={benchmarkData.education_level}
                  onChange={(e) => setBenchmarkData({...benchmarkData, education_level: e.target.value})}
                />
                <Input
                  placeholder="Industry"
                  value={benchmarkData.industry}
                  onChange={(e) => setBenchmarkData({...benchmarkData, industry: e.target.value})}
                />
                <Input
                  placeholder="Company Size (employees)"
                  value={benchmarkData.company_size}
                  onChange={(e) => setBenchmarkData({...benchmarkData, company_size: e.target.value})}
                />
              </div>
              <Button
                onClick={benchmarkSalary}
                disabled={analyzing || !benchmarkData.position.trim()}
                className="w-full"
              >
                {analyzing ? 'Benchmarking...' : 'Benchmark Salary'}
              </Button>
            </div>
          )}

          {activeTab === 'zakat' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder="Employee ID"
                  value={zakatData.employee_id}
                  onChange={(e) => setZakatData({...zakatData, employee_id: e.target.value})}
                />
                <Input
                  placeholder="Annual Salary (RM)"
                  value={zakatData.annual_salary}
                  onChange={(e) => setZakatData({...zakatData, annual_salary: e.target.value})}
                />
                <Input
                  placeholder="Additional Income (RM)"
                  value={zakatData.additional_income}
                  onChange={(e) => setZakatData({...zakatData, additional_income: e.target.value})}
                />
                <Input
                  placeholder="Zakat Year"
                  value={zakatData.zakat_year}
                  onChange={(e) => setZakatData({...zakatData, zakat_year: e.target.value})}
                />
                <Input
                  placeholder="Marital Status"
                  value={zakatData.marital_status}
                  onChange={(e) => setZakatData({...zakatData, marital_status: e.target.value})}
                />
                <Input
                  placeholder="Number of Dependents"
                  value={zakatData.dependents}
                  onChange={(e) => setZakatData({...zakatData, dependents: e.target.value})}
                />
              </div>
              <Button
                onClick={calculateZakat}
                disabled={analyzing || !zakatData.employee_id.trim()}
                className="w-full"
              >
                {analyzing ? 'Calculating...' : 'Calculate Zakat'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {analysisResult && (
        <Card>
          <CardHeader>
            <CardTitle>Analysis Result</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p><strong>Success:</strong> {analysisResult.success ? 'Yes' : 'No'}</p>
              {analysisResult.response && (
                <div>
                  {analysisResult.response.market_salary_range && (
                    <div className="mt-2">
                      <strong>Market Salary Range:</strong>
                      <p className="text-sm">Min: RM{analysisResult.response.market_salary_range.min.toLocaleString()} - Max: RM{analysisResult.response.market_salary_range.max.toLocaleString()}</p>
                      <p className="text-sm">Median: RM{analysisResult.response.market_salary_range.median.toLocaleString()}</p>
                    </div>
                  )}
                  {analysisResult.response.percentile_25 && (
                    <p><strong>25th Percentile:</strong> RM{analysisResult.response.percentile_25.toLocaleString()}</p>
                  )}
                  {analysisResult.response.percentile_75 && (
                    <p><strong>75th Percentile:</strong> RM{analysisResult.response.percentile_75.toLocaleString()}</p>
                  )}
                  {analysisResult.response.zakat_amount && (
                    <p><strong>Zakat Amount:</strong> RM{analysisResult.response.zakat_amount.toLocaleString()}</p>
                  )}
                  {analysisResult.response.zakat_percentage && (
                    <p><strong>Zakat Percentage:</strong> {analysisResult.response.zakat_percentage}%</p>
                  )}
                  {analysisResult.response.nisab_threshold && (
                    <p><strong>Nisab Threshold:</strong> RM{analysisResult.response.nisab_threshold.toLocaleString()}</p>
                  )}
                  {analysisResult.response.zakat_eligible !== undefined && (
                    <p><strong>Zakat Eligible:</strong> {analysisResult.response.zakat_eligible ? 'Yes' : 'No'}</p>
                  )}
                  {analysisResult.response.pay_equity_score && (
                    <p><strong>Pay Equity Score:</strong> {analysisResult.response.pay_equity_score}/100</p>
                  )}
                  {analysisResult.response.competitor_comparison && (
                    <div className="mt-2">
                      <strong>Competitor Comparison:</strong>
                      <ul className="list-disc list-inside mt-1">
                        {analysisResult.response.competitor_comparison.map((comp: any, idx: number) => (
                          <li key={idx} className="text-sm">{comp.company}: RM{comp.salary.toLocaleString()}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {analysisResult.response.recommendations && (
                    <div className="mt-2">
                      <strong>Recommendations:</strong>
                      <ul className="list-disc list-inside mt-1">
                        {analysisResult.response.recommendations.map((rec: string, idx: number) => (
                          <li key={idx} className="text-sm">{rec}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
              {analysisResult.message && (
                <p><strong>Message:</strong> {analysisResult.message}</p>
              )}
              {analysisResult.compliance_notes && (
                <div className="mt-2">
                  <strong>Compliance Notes:</strong>
                  <ul className="list-disc list-inside mt-1">
                    {analysisResult.compliance_notes.map((note: string, idx: number) => (
                      <li key={idx} className="text-sm">{note}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
