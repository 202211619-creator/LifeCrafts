import React, { useState } from 'react';
import { Calculator, Zap, Droplets, Sprout, Recycle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

function SolarCalculator() {
  const [dailyUsage, setDailyUsage] = useState('');
  const [sunHours, setSunHours] = useState('');
  const [result, setResult] = useState<any>(null);

  const calculateSolar = () => {
    const usage = parseFloat(dailyUsage);
    const hours = parseFloat(sunHours);
    
    if (usage && hours) {
      const panelWatts = (usage / hours) * 1.3; // 30% safety margin
      const batteries = usage * 3; // 3 days backup
      
      setResult({
        panelWatts: Math.ceil(panelWatts),
        batteries: Math.ceil(batteries),
        cost: Math.ceil(panelWatts * 2 + batteries * 1.5)
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="w-5 h-5" />
          Solar Panel Calculator
        </CardTitle>
        <CardDescription>Calculate your solar panel and battery needs</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="daily-usage">Daily Energy Usage (kWh)</Label>
            <Input
              id="daily-usage"
              type="number"
              placeholder="5"
              value={dailyUsage}
              onChange={(e) => setDailyUsage(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="sun-hours">Peak Sun Hours</Label>
            <Input
              id="sun-hours"
              type="number"
              placeholder="6"
              value={sunHours}
              onChange={(e) => setSunHours(e.target.value)}
            />
          </div>
        </div>
        
        <Button onClick={calculateSolar} className="w-full">Calculate</Button>
        
        {result && (
          <div className="bg-muted p-4 rounded-lg space-y-2">
            <div className="flex justify-between">
              <span>Solar Panels Needed:</span>
              <span className="font-medium">{result.panelWatts}W</span>
            </div>
            <div className="flex justify-between">
              <span>Battery Capacity:</span>
              <span className="font-medium">{result.batteries}Ah</span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span>Estimated Cost:</span>
              <span className="font-medium">${result.cost}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function WaterCalculator() {
  const [roofArea, setRoofArea] = useState('');
  const [rainfall, setRainfall] = useState('');
  const [result, setResult] = useState<any>(null);

  const calculateWater = () => {
    const area = parseFloat(roofArea);
    const rain = parseFloat(rainfall);
    
    if (area && rain) {
      const monthlyCollection = area * rain * 0.623; // gallons
      const tankSize = monthlyCollection * 2; // 2 months storage
      
      setResult({
        monthly: Math.ceil(monthlyCollection),
        tankSize: Math.ceil(tankSize),
        yearly: Math.ceil(monthlyCollection * 12)
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Droplets className="w-5 h-5" />
          Rainwater Harvesting
        </CardTitle>
        <CardDescription>Calculate rainwater collection potential</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="roof-area">Roof Area (sq ft)</Label>
            <Input
              id="roof-area"
              type="number"
              placeholder="1200"
              value={roofArea}
              onChange={(e) => setRoofArea(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="rainfall">Monthly Rainfall (inches)</Label>
            <Input
              id="rainfall"
              type="number"
              placeholder="4"
              value={rainfall}
              onChange={(e) => setRainfall(e.target.value)}
            />
          </div>
        </div>
        
        <Button onClick={calculateWater} className="w-full">Calculate</Button>
        
        {result && (
          <div className="bg-muted p-4 rounded-lg space-y-2">
            <div className="flex justify-between">
              <span>Monthly Collection:</span>
              <span className="font-medium">{result.monthly} gallons</span>
            </div>
            <div className="flex justify-between">
              <span>Yearly Collection:</span>
              <span className="font-medium">{result.yearly} gallons</span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span>Recommended Tank:</span>
              <span className="font-medium">{result.tankSize} gallons</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function CompostCalculator() {
  const [foodWaste, setFoodWaste] = useState('');
  const [yardWaste, setYardWaste] = useState('');
  const [result, setResult] = useState<any>(null);

  const calculateCompost = () => {
    const food = parseFloat(foodWaste);
    const yard = parseFloat(yardWaste);
    
    if (food || yard) {
      const totalWaste = (food || 0) + (yard || 0);
      const compostYield = totalWaste * 0.3; // 30% final compost
      const timeWeeks = Math.ceil(totalWaste / 5) + 8; // processing time
      
      setResult({
        totalWaste,
        compostYield: compostYield.toFixed(1),
        timeWeeks,
        binSize: Math.ceil(totalWaste / 2)
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Recycle className="w-5 h-5" />
          Composting Calculator
        </CardTitle>
        <CardDescription>Plan your composting system</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="food-waste">Food Waste (lbs/week)</Label>
            <Input
              id="food-waste"
              type="number"
              placeholder="10"
              value={foodWaste}
              onChange={(e) => setFoodWaste(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="yard-waste">Yard Waste (lbs/week)</Label>
            <Input
              id="yard-waste"
              type="number"
              placeholder="15"
              value={yardWaste}
              onChange={(e) => setYardWaste(e.target.value)}
            />
          </div>
        </div>
        
        <Button onClick={calculateCompost} className="w-full">Calculate</Button>
        
        {result && (
          <div className="bg-muted p-4 rounded-lg space-y-2">
            <div className="flex justify-between">
              <span>Weekly Input:</span>
              <span className="font-medium">{result.totalWaste} lbs</span>
            </div>
            <div className="flex justify-between">
              <span>Compost Yield:</span>
              <span className="font-medium">{result.compostYield} lbs/week</span>
            </div>
            <div className="flex justify-between">
              <span>Processing Time:</span>
              <span className="font-medium">{result.timeWeeks} weeks</span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span>Bin Size Needed:</span>
              <span className="font-medium">{result.binSize} cubic feet</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function CropPlanner() {
  const [location, setLocation] = useState('');
  const [soilType, setSoilType] = useState('');
  const [season, setSeason] = useState('');

  const cropRecommendations = {
    spring: ['Lettuce', 'Spinach', 'Peas', 'Radishes', 'Carrots'],
    summer: ['Tomatoes', 'Peppers', 'Beans', 'Squash', 'Corn'],
    fall: ['Kale', 'Brussels Sprouts', 'Broccoli', 'Turnips', 'Cabbage'],
    winter: ['Garlic', 'Onions', 'Winter Squash', 'Stored Root Vegetables']
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sprout className="w-5 h-5" />
          Crop Planner
        </CardTitle>
        <CardDescription>Get personalized crop recommendations</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <div>
            <Label htmlFor="location">Growing Zone</Label>
            <Select value={location} onValueChange={setLocation}>
              <SelectTrigger>
                <SelectValue placeholder="Select your zone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3a">Zone 3a</SelectItem>
                <SelectItem value="4a">Zone 4a</SelectItem>
                <SelectItem value="5a">Zone 5a</SelectItem>
                <SelectItem value="6a">Zone 6a</SelectItem>
                <SelectItem value="7a">Zone 7a</SelectItem>
                <SelectItem value="8a">Zone 8a</SelectItem>
                <SelectItem value="9a">Zone 9a</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="soil">Soil Type</Label>
            <Select value={soilType} onValueChange={setSoilType}>
              <SelectTrigger>
                <SelectValue placeholder="Select soil type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="clay">Clay</SelectItem>
                <SelectItem value="sandy">Sandy</SelectItem>
                <SelectItem value="loam">Loam</SelectItem>
                <SelectItem value="rocky">Rocky</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="season">Season</Label>
            <Select value={season} onValueChange={setSeason}>
              <SelectTrigger>
                <SelectValue placeholder="Select season" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="spring">Spring</SelectItem>
                <SelectItem value="summer">Summer</SelectItem>
                <SelectItem value="fall">Fall</SelectItem>
                <SelectItem value="winter">Winter</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {season && (
          <div className="bg-muted p-4 rounded-lg">
            <h4 className="font-medium mb-2">Recommended Crops for {season}:</h4>
            <div className="flex flex-wrap gap-2">
              {cropRecommendations[season as keyof typeof cropRecommendations].map((crop) => (
                <span key={crop} className="bg-background px-2 py-1 rounded text-sm">
                  {crop}
                </span>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function ToolsCalculators() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <Calculator className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h2>Survival & Sustainability Tools</h2>
        <p className="text-muted-foreground">Practical calculators for off-grid living</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <SolarCalculator />
        <WaterCalculator />
        <CompostCalculator />
        <CropPlanner />
      </div>
    </div>
  );
}