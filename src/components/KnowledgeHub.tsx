import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  Droplets, 
  Sprout, 
  Recycle, 
  Shield, 
  Wrench, 
  Heart, 
  MapPin,
  BookOpen,
  Video,
  FileText,
  Image,
  Search,
  ArrowLeft,
  Loader2,
  ExternalLink
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

const categories = [
  { id: 'energy', name: 'Energy', icon: Zap, color: 'bg-yellow-500', keywords: 'solar power renewable energy' },
  { id: 'water', name: 'Water', icon: Droplets, color: 'bg-blue-500', keywords: 'water purification filtration' },
  { id: 'food', name: 'Food Production', icon: Sprout, color: 'bg-green-500', keywords: 'gardening farming composting' },
  { id: 'waste', name: 'Waste Management', icon: Recycle, color: 'bg-purple-500', keywords: 'recycling composting waste' },
  { id: 'survival', name: 'Survival Skills', icon: Shield, color: 'bg-red-500', keywords: 'survival emergency preparedness' },
  { id: 'repairs', name: 'Repairs', icon: Wrench, color: 'bg-orange-500', keywords: 'repair fix maintenance' },
  { id: 'medicine', name: 'Medicine', icon: Heart, color: 'bg-pink-500', keywords: 'first aid health medical' },
  { id: 'navigation', name: 'Navigation', icon: MapPin, color: 'bg-indigo-500', keywords: 'navigation compass direction' },
];

const typeIcons = {
  article: BookOpen,
  video: Video,
  tutorial: FileText,
  guide: Image,
};

export function KnowledgeHub() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [guides, setGuides] = useState([]);
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [loading, setLoading] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    if (selectedCategory) {
      fetchGuidesForCategory(selectedCategory);
    }
  }, [selectedCategory]);

  const fetchGuidesForCategory = async (categoryId) => {
    setLoading(true);
    try {
      const category = categories.find(c => c.id === categoryId);
      if (!category) return;

      // Hardcoded fallback content for Energy category
      if (categoryId === 'energy') {
        const fallbackGuides = [
          {
            id: 'energy-1',
            title: 'Build a Simple Solar Panel System',
            description: 'Learn how to construct a basic solar panel system for your home using readily available materials and tools.',
            category: 'energy',
            type: 'tutorial',
            difficulty: 'Intermediate',
            duration: '20-30 min read',
            image: null,
            categoryIcon: category.icon,
            categoryColor: category.color,
            url: 'https://www.wikihow.com/Build-a-Solar-Panel',
            source: 'WikiHow',
            content: {
              introduction: 'Solar energy is one of the most accessible forms of renewable energy for individuals. Building your own solar panel system can significantly reduce your electricity bills and provide power during emergencies. This guide will walk you through the basics of creating a simple solar panel system.',
              steps: [
                {
                  title: 'Gather Your Materials',
                  description: 'You will need: solar cells (36 cells for a 12V panel), tabbing wire, bus wire, flux pen, soldering iron, plywood backing, plexiglass cover, silicone sealant, and a junction box with diodes.'
                },
                {
                  title: 'Prepare the Solar Cells',
                  description: 'Carefully unpack your solar cells and arrange them on your work surface. Test each cell with a multimeter to ensure they are functioning properly before proceeding.'
                },
                {
                  title: 'Connect the Cells in Series',
                  description: 'Using tabbing wire, connect the positive terminal of one cell to the negative terminal of the next. Apply flux and solder carefully to create strong connections. Connect 6 strings of 6 cells each.'
                },
                {
                  title: 'Mount Cells on Backing',
                  description: 'Prepare a plywood backing board painted white to reflect light. Apply small dabs of silicone to secure each cell string to the backing, leaving space for thermal expansion.'
                },
                {
                  title: 'Wire the Strings Together',
                  description: 'Use bus wire to connect all 6 strings in series. This will create the appropriate voltage output. Connect the final positive and negative leads to your junction box.'
                },
                {
                  title: 'Seal and Protect',
                  description: 'Cover the panel with plexiglass, sealing all edges with silicone to make it weatherproof. Install blocking diodes in the junction box to prevent reverse current flow at night.'
                },
                {
                  title: 'Test Your Panel',
                  description: 'Before permanent installation, test your panel in direct sunlight with a multimeter. You should see approximately 18-20V open circuit voltage for a 12V panel.'
                }
              ],
              tips: [
                'Work in a clean, dust-free environment when handling solar cells as they are fragile',
                'Consider purchasing pre-tabbed solar cells to save time and effort',
                'Always use blocking diodes to protect your battery from discharge at night',
                'Mount your panel at an angle equal to your latitude for optimal year-round performance',
                'Start with a small system and expand as you gain experience'
              ],
              warnings: [
                'Solar cells are extremely fragile - handle with care',
                'Always use proper eye protection when soldering',
                'Ensure all electrical connections are properly insulated to prevent shorts',
                'Do not connect panels directly to batteries without a charge controller'
              ]
            }
          },
          {
            id: 'energy-2',
            title: 'Create a Wind Turbine Generator',
            description: 'Construct a small wind turbine to generate electricity from wind power using basic materials.',
            category: 'energy',
            type: 'tutorial',
            difficulty: 'Advanced',
            duration: '30-45 min read',
            image: null,
            categoryIcon: category.icon,
            categoryColor: category.color,
            url: 'https://www.wikihow.com/Build-a-Wind-Turbine',
            source: 'WikiHow',
            content: {
              introduction: 'Wind energy is a powerful renewable resource. A small wind turbine can supplement your energy needs or charge batteries for off-grid applications.',
              steps: [
                {
                  title: 'Design Your Blades',
                  description: 'Create three blades from PVC pipe or wood. Each blade should be identical in size and weight for balanced rotation. Typical length for a small turbine is 2-4 feet.'
                },
                {
                  title: 'Build the Hub',
                  description: 'Attach the blades to a central hub at equal angles (120 degrees apart). The hub should connect to your generator motor shaft.'
                },
                {
                  title: 'Select a Generator',
                  description: 'Use a permanent magnet DC motor as your generator. Car alternators or stepper motors work well for small turbines.'
                },
                {
                  title: 'Construct the Mounting',
                  description: 'Build a sturdy mounting system that allows the turbine to rotate and face the wind. Include a tail vane for directional control.'
                },
                {
                  title: 'Wire the System',
                  description: 'Connect the generator to a charge controller and battery bank. Include a dump load to protect the system in high winds.'
                }
              ],
              tips: [
                'Test your turbine design in a controlled environment before installation',
                'Ensure blades are perfectly balanced to prevent vibration',
                'Install turbine at least 30 feet above ground for better wind access'
              ],
              warnings: [
                'Rotating blades can cause serious injury - maintain safe distance',
                'Secure mounting must withstand high wind loads',
                'Check local regulations before installing wind turbines'
              ]
            }
          },
          {
            id: 'energy-3',
            title: 'Make a Bicycle Generator',
            description: 'Convert a bicycle into a pedal-powered generator for charging batteries or powering small devices.',
            category: 'energy',
            type: 'tutorial',
            difficulty: 'Beginner',
            duration: '15-20 min read',
            image: null,
            categoryIcon: category.icon,
            categoryColor: category.color,
            url: 'https://www.wikihow.com/Make-a-Bicycle-Generator',
            source: 'WikiHow',
            content: {
              introduction: 'A bicycle generator is an excellent way to convert human power into electricity. This is perfect for emergency situations, off-grid living, or simply staying fit while charging your devices.',
              steps: [
                {
                  title: 'Choose Your Bicycle',
                  description: 'Select a sturdy bicycle with a working rear wheel. Mountain bikes or road bikes work well. The bicycle should be in good condition with properly inflated tires.'
                },
                {
                  title: 'Select a Generator',
                  description: 'Use a permanent magnet DC motor (24V recommended) or a car alternator. Motors from treadmills or old appliances work well.'
                },
                {
                  title: 'Build a Stand',
                  description: 'Create or purchase a bicycle trainer stand that lifts the rear wheel off the ground. This allows the wheel to spin freely while you pedal.'
                },
                {
                  title: 'Mount the Generator',
                  description: 'Attach the generator to the stand so its shaft contacts the rear tire. Use a friction drive system where the generator shaft presses against the tire.'
                },
                {
                  title: 'Add Electrical Components',
                  description: 'Connect the generator output to a rectifier (to convert AC to DC), then to a charge controller, and finally to a battery bank or inverter.'
                },
                {
                  title: 'Test and Adjust',
                  description: 'Start pedaling and check voltage output with a multimeter. Adjust pressure between generator and tire for optimal power generation without excessive resistance.'
                }
              ],
              tips: [
                'Add a voltmeter display so you can see power generation in real-time',
                'Use a gel seat for comfort during longer pedaling sessions',
                'Keep a spare tire as the friction will cause wear over time',
                'Consider adding a flywheel for smoother power generation',
                'Aim for comfortable pedaling cadence around 60-80 RPM'
              ],
              warnings: [
                'Ensure all electrical connections are properly insulated',
                'Do not exceed the voltage rating of your charge controller',
                'Secure all components to prevent movement during use',
                'Allow generator to cool down after extended use'
              ]
            }
          }
        ];
        
        setGuides(fallbackGuides);
        return;
      }

      const searchTerm = category.keywords.split(' ')[0];
      const wikiHowResults = await fetchWikiHow(searchTerm);
      
      setGuides(wikiHowResults);
    } catch (error) {
      console.error('Error fetching guides:', error);
      setGuides([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchWikiHow = async (searchTerm) => {
    try {
      const response = await fetch(
        `https://www.wikihow.com/api.php?action=query&list=search&srsearch=${encodeURIComponent(searchTerm)}&format=json&origin=*`
      );
      const data = await response.json();
      
      if (data.query?.search) {
        const category = categories.find(c => c.id === selectedCategory);
        
        return data.query.search.slice(0, 6).map((item) => ({
          id: `wikihow-${item.pageid}`,
          title: item.title.replace('How to ', ''),
          description: item.snippet.replace(/<[^>]*>/g, '').substring(0, 150) + '...',
          category: selectedCategory || 'general',
          type: 'article',
          difficulty: 'Intermediate',
          duration: '15-30 min read',
          image: null,
          categoryIcon: category?.icon,
          categoryColor: category?.color,
          url: `https://www.wikihow.com/${item.title.replace(/ /g, '-')}`,
          source: 'WikiHow'
        }));
      }
    } catch (error) {
      console.error('WikiHow fetch error:', error);
    }
    return [];
  };

  const fetchGuideDetail = async (guide) => {
    // If guide already has content (hardcoded), use it directly
    if (guide.content) {
      setSelectedGuide(guide);
      return;
    }

    setDetailLoading(true);
    try {
      const originalTitle = guide.url.split('/').pop();
      
      const response = await fetch(
        `https://www.wikihow.com/api.php?action=parse&page=${originalTitle}&format=json&origin=*&prop=text|images`
      );
      const data = await response.json();
      
      if (data.parse?.text) {
        const htmlContent = data.parse.text['*'];
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlContent, 'text/html');
        
        let stepElements = doc.querySelectorAll('.step');
        
        if (stepElements.length === 0) {
          stepElements = doc.querySelectorAll('.steps_list_2 li, ol li, [data-methods] li');
        }
        
        const steps = Array.from(stepElements).map((step, index) => {
          const stepText = step.textContent?.trim() || '';
          const stepImg = step.querySelector('img')?.dataset?.src || 
                         step.querySelector('img')?.src ||
                         step.querySelector('[data-src]')?.dataset?.src;
          
          return {
            title: `Step ${index + 1}`,
            description: stepText,
            image: stepImg
          };
        }).filter(step => step.description.length > 15);

        let intro = '';
        const allParagraphs = doc.querySelectorAll('p');
        
        intro = Array.from(allParagraphs)
          .slice(0, 5)
          .map(p => p.textContent?.trim())
          .filter(text => text && text.length > 30)
          .join('\n\n');
        
        if (!intro) intro = guide.description;

        const tipElements = doc.querySelectorAll('li');
        const tips = Array.from(tipElements)
          .map(tip => tip.textContent?.trim())
          .filter(tip => {
            const lower = tip?.toLowerCase() || '';
            return tip && 
                   tip.length > 15 && 
                   tip.length < 300 &&
                   (lower.includes('tip') || lower.includes('helpful') || lower.includes('remember'));
          })
          .slice(0, 10);

        setSelectedGuide({
          ...guide,
          content: {
            introduction: intro,
            steps: steps.length > 0 ? steps : [{ 
              title: 'View on WikiHow', 
              description: 'The content structure could not be parsed automatically. Click "View Original Article" button above to read the complete guide on WikiHow.' 
            }],
            tips: tips,
            warnings: ['Always follow safety precautions and read the complete article before attempting']
          }
        });
      } else {
        setSelectedGuide({
          ...guide,
          content: {
            introduction: guide.description,
            steps: [{ 
              title: 'View on WikiHow', 
              description: 'Click "View Original Article" button above to read the complete guide.' 
            }],
            tips: [],
            warnings: ['Always follow safety precautions']
          }
        });
      }
    } catch (error) {
      console.error('Error fetching guide detail:', error);
      setSelectedGuide({
        ...guide,
        content: {
          introduction: guide.description,
          steps: [{ 
            title: 'View on WikiHow', 
            description: 'There was an error loading the content. Click "View Original Article" button above to read the guide.' 
          }],
          tips: [],
          warnings: ['Always follow safety precautions']
        }
      });
    } finally {
      setDetailLoading(false);
    }
  };

  const filteredGuides = guides.filter(guide => {
    if (!searchQuery) return true;
    return guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
           guide.description.toLowerCase().includes(searchQuery.toLowerCase());
  });

  if (selectedGuide) {
    const TypeIcon = typeIcons[selectedGuide.type];
    
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => setSelectedGuide(null)} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to guides
        </Button>

        {detailLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="aspect-video relative overflow-hidden rounded-lg bg-muted">
                {selectedGuide.image ? (
                  <img
                    src={selectedGuide.image}
                    alt={selectedGuide.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.parentElement.innerHTML = `<div class="w-full h-full flex items-center justify-center ${selectedGuide.categoryColor}"><svg class="w-24 h-24 text-white opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg></div>`;
                    }}
                  />
                ) : (
                  <div className={`w-full h-full flex items-center justify-center ${selectedGuide.categoryColor}`}>
                    {selectedGuide.categoryIcon && React.createElement(selectedGuide.categoryIcon, { className: 'w-24 h-24 text-white opacity-80' })}
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="secondary" className="gap-1">
                    <TypeIcon className="w-3 h-3" />
                    {selectedGuide.type}
                  </Badge>
                  <Badge variant="outline">{selectedGuide.difficulty}</Badge>
                  <Badge variant="outline">{selectedGuide.duration}</Badge>
                  <Badge>{selectedGuide.source}</Badge>
                </div>
                
                <h1 className="text-3xl font-bold">{selectedGuide.title}</h1>
                <p className="text-lg text-muted-foreground">{selectedGuide.description}</p>
                
                <Button variant="outline" className="gap-2" onClick={() => window.open(selectedGuide.url, '_blank')}>
                  View Original Article
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {selectedGuide.content && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Introduction</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{selectedGuide.content.introduction}</p>
                  </CardContent>
                </Card>

                {selectedGuide.content.warnings && selectedGuide.content.warnings.length > 0 && (
                  <Card className="border-orange-500 bg-orange-50 dark:bg-orange-950">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-orange-700 dark:text-orange-400">
                        <Shield className="w-5 h-5" />
                        Safety & Warnings
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {selectedGuide.content.warnings.map((warning, index) => (
                          <li key={index} className="flex items-start gap-2 text-orange-700 dark:text-orange-400">
                            <span className="mt-1">⚠</span>
                            <span>{warning}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                <div className="space-y-4">
                  <h2 className="text-2xl font-bold">Step-by-Step Guide</h2>
                  {selectedGuide.content.steps.map((step, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-3">
                          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold shrink-0">
                            {index + 1}
                          </span>
                          <span>{step.title}</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {step.image && (
                          <img 
                            src={step.image} 
                            alt={step.title}
                            className="w-full rounded-lg"
                            onError={(e) => e.currentTarget.style.display = 'none'}
                          />
                        )}
                        <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {selectedGuide.content.tips && selectedGuide.content.tips.length > 0 && (
                  <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-900">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-400">
                        💡 Helpful Tips
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {selectedGuide.content.tips.map((tip, index) => (
                          <li key={index} className="flex items-start gap-2 text-blue-700 dark:text-blue-400">
                            <span className="mt-1 shrink-0">•</span>
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search guides..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categories.map((category) => {
          const Icon = category.icon;
          const isSelected = selectedCategory === category.id;
          
          return (
            <Button
              key={category.id}
              variant={isSelected ? "default" : "outline"}
              className="h-20 flex-col gap-2 p-4"
              onClick={() => setSelectedCategory(isSelected ? null : category.id)}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${category.color} ${isSelected ? 'text-white' : 'text-white'}`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-xs text-center">{category.name}</span>
            </Button>
          );
        })}
      </div>

      {/* Active Filter */}
      {selectedCategory && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Showing:</span>
          <Badge variant="secondary" className="gap-1">
            {categories.find(c => c.id === selectedCategory)?.name}
            <Button
              variant="ghost"
              size="sm"
              className="h-4 w-4 p-0 hover:bg-transparent"
              onClick={() => setSelectedCategory(null)}
            >
              ×
            </Button>
          </Badge>
        </div>
      )}

      {/* Guides Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGuides.map((guide) => {
            const TypeIcon = typeIcons[guide.type];
            const CategoryIcon = guide.categoryIcon;
            
            return (
              <Card 
                key={guide.id} 
                className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => fetchGuideDetail(guide)}
              >
                <div className="aspect-video relative overflow-hidden">
                  {guide.image ? (
                    <img
                      src={guide.image}
                      alt={guide.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className={`w-full h-full flex items-center justify-center ${guide.categoryColor}`}>
                      <CategoryIcon className="w-24 h-24 text-white opacity-80" />
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <Badge variant="secondary" className="gap-1">
                      <TypeIcon className="w-3 h-3" />
                      {guide.type}
                    </Badge>
                  </div>
                </div>
                
                <CardHeader className="pb-2">
                  <CardTitle className="text-base line-clamp-2">{guide.title}</CardTitle>
                  <CardDescription className="line-clamp-2">{guide.description}</CardDescription>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{guide.difficulty}</span>
                    <span>{guide.duration}</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {filteredGuides.length === 0 && selectedCategory && !loading && (
        <div className="text-center py-12">
          <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No guides found</h3>
          <p className="text-muted-foreground">Try selecting a different category</p>
        </div>
      )}
    </div>
  );
}