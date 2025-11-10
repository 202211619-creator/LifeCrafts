import React, { useState } from 'react';
import { 
  ShoppingCart, 
  Plus, 
  MapPin, 
  Clock, 
  Star,
  Package,
  BookOpen,
  Leaf,
  Zap,
  Filter,
  Search
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ImageWithFallback } from './figma/ImageWithFallback';

const marketplaceItems = [
  {
    id: 1,
    type: 'physical',
    category: 'seeds',
    title: 'Heirloom Tomato Seeds - 10 Varieties',
    description: 'Organic, non-GMO seeds from my garden. Cherokee Purple, Brandywine, and more!',
    price: 15,
    currency: 'points',
    image: 'https://images.unsplash.com/photo-1592841200221-471a4038c4d2?w=400',
    seller: {
      name: 'Sarah Chen',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b029?w=100',
      rating: 4.9,
      trades: 47
    },
    location: '5 miles away',
    timePosted: '2 hours ago',
    availability: 'Available'
  },
  {
    id: 2,
    type: 'guide',
    category: 'knowledge',
    title: 'Complete Solar Installation Guide',
    description: 'Step-by-step PDF guide with wiring diagrams for 1-5kW off-grid systems',
    price: 25,
    currency: 'points',
    image: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=400',
    seller: {
      name: 'Mike Torres',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
      rating: 4.8,
      trades: 23
    },
    location: 'Digital Download',
    timePosted: '1 day ago',
    availability: 'Available'
  },
  {
    id: 3,
    type: 'physical',
    category: 'compost',
    title: 'Red Worm Composting Starter Kit',
    description: '200 red worms + bedding material + feeding guide. Perfect for apartment composting!',
    price: 30,
    currency: 'points',
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400',
    seller: {
      name: 'Emma Rodriguez',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
      rating: 5.0,
      trades: 12
    },
    location: '12 miles away',
    timePosted: '3 days ago',
    availability: 'Available'
  },
  {
    id: 4,
    type: 'tool',
    category: 'tools',
    title: 'Hand-forged Garden Tools Set',
    description: 'Custom blacksmith tools: hoe, cultivator, and weeder. Built to last generations.',
    price: 120,
    currency: 'points',
    image: 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=400',
    seller: {
      name: 'Alex Kumar',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
      rating: 4.7,
      trades: 8
    },
    location: '25 miles away',
    timePosted: '1 week ago',
    availability: 'Available'
  },
  {
    id: 5,
    type: 'guide',
    category: 'knowledge',
    title: 'Permaculture Design Course Materials',
    description: 'Complete 72-hour PDC materials including videos, worksheets, and design templates',
    price: 50,
    currency: 'points',
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400',
    seller: {
      name: 'Jamie Wilson',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
      rating: 4.9,
      trades: 31
    },
    location: 'Digital Download',
    timePosted: '5 days ago',
    availability: 'Available'
  },
  {
    id: 6,
    type: 'physical',
    category: 'energy',
    title: 'Reconditioned 100W Solar Panel',
    description: 'Tested working panel, minor cosmetic scratches. Great for beginners!',
    price: 80,
    currency: 'points',
    image: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=400',
    seller: {
      name: 'Sam Johnson',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
      rating: 4.6,
      trades: 15
    },
    location: '8 miles away',
    timePosted: '4 days ago',
    availability: 'Available'
  }
];

const categories = [
  { id: 'all', name: 'All Items', icon: Package },
  { id: 'seeds', name: 'Seeds & Plants', icon: Leaf },
  { id: 'tools', name: 'Tools & Equipment', icon: Package },
  { id: 'energy', name: 'Energy Systems', icon: Zap },
  { id: 'knowledge', name: 'Guides & Courses', icon: BookOpen },
  { id: 'compost', name: 'Composting', icon: Leaf }
];

function MarketplaceFeed() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recent');

  const filteredItems = marketplaceItems.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search marketplace..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Most Recent</SelectItem>
            <SelectItem value="price-low">Price: Low to High</SelectItem>
            <SelectItem value="price-high">Price: High to Low</SelectItem>
            <SelectItem value="rating">Highest Rated</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map((category) => {
          const Icon = category.icon;
          const isSelected = selectedCategory === category.id;
          
          return (
            <Button
              key={category.id}
              variant={isSelected ? "default" : "outline"}
              size="sm"
              className="whitespace-nowrap gap-2"
              onClick={() => setSelectedCategory(category.id)}
            >
              <Icon className="w-4 h-4" />
              {category.name}
            </Button>
          );
        })}
      </div>

      {/* Items Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-video relative overflow-hidden">
              <ImageWithFallback
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 left-2">
                <Badge variant="secondary">{item.type}</Badge>
              </div>
              <div className="absolute top-2 right-2">
                <Badge variant="default">{item.availability}</Badge>
              </div>
            </div>
            
            <CardHeader className="pb-2">
              <CardTitle className="text-base line-clamp-2">{item.title}</CardTitle>
              <CardDescription className="line-clamp-2">{item.description}</CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <span className="text-lg font-bold text-primary">{item.price}</span>
                  <span className="text-sm text-muted-foreground">points</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">{item.location}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Avatar className="w-6 h-6">
                  <AvatarImage src={item.seller.avatar} />
                  <AvatarFallback>{item.seller.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{item.seller.name}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span>{item.seller.rating}</span>
                    </div>
                    <span>•</span>
                    <span>{item.seller.trades} trades</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  <span>{item.timePosted}</span>
                </div>
                <Button size="sm">Contact Seller</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No items found</h3>
          <p className="text-muted-foreground">Try adjusting your search or category filter</p>
        </div>
      )}
    </div>
  );
}

function MyListings() {
  const [userListings] = useState([
    {
      id: 1,
      title: 'Homemade Compost - Rich Black Gold',
      type: 'physical',
      price: 10,
      views: 23,
      inquiries: 4,
      status: 'active'
    },
    {
      id: 2,
      title: 'Rainwater Collection Setup Guide',
      type: 'guide',
      price: 20,
      views: 67,
      inquiries: 8,
      status: 'active'
    }
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3>My Listings</h3>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Add Listing
        </Button>
      </div>

      <div className="space-y-4">
        {userListings.map((listing) => (
          <Card key={listing.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="font-medium">{listing.title}</h4>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                    <span>{listing.price} points</span>
                    <span>{listing.views} views</span>
                    <span>{listing.inquiries} inquiries</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={listing.status === 'active' ? 'default' : 'secondary'}>
                    {listing.status}
                  </Badge>
                  <Button variant="outline" size="sm">Edit</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {userListings.length === 0 && (
        <div className="text-center py-12">
          <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No listings yet</h3>
          <p className="text-muted-foreground mb-4">Share your knowledge and resources with the community</p>
          <Button>Create Your First Listing</Button>
        </div>
      )}
    </div>
  );
}

function PointsWallet() {
  const [userPoints] = useState(156);
  const [recentTransactions] = useState([
    { id: 1, type: 'earned', amount: 25, description: 'Guide uploaded: Solar Installation', date: '2 days ago' },
    { id: 2, type: 'spent', amount: -15, description: 'Purchased: Tomato Seeds', date: '5 days ago' },
    { id: 3, type: 'earned', amount: 20, description: 'Challenge completed: Fire Master', date: '1 week ago' },
    { id: 4, type: 'earned', amount: 10, description: 'Community contribution bonus', date: '2 weeks ago' }
  ]);

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
        <CardContent className="p-6">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-2">{userPoints}</h3>
            <p className="text-primary-foreground/80">Available Points</p>
          </div>
          <div className="flex justify-center mt-4">
            <Button variant="secondary" size="sm">
              Earn More Points
            </Button>
          </div>
        </CardContent>
      </Card>

      <div>
        <h4 className="font-medium mb-4">How to Earn Points</h4>
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <BookOpen className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <h5 className="font-medium">Share Guides</h5>
              <p className="text-sm text-muted-foreground">10-50 points per guide</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Star className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
              <h5 className="font-medium">Complete Challenges</h5>
              <p className="text-sm text-muted-foreground">5-25 points per challenge</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div>
        <h4 className="font-medium mb-4">Recent Transactions</h4>
        <div className="space-y-3">
          {recentTransactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between p-3 rounded-lg border">
              <div className="flex-1">
                <p className="text-sm font-medium">{transaction.description}</p>
                <p className="text-xs text-muted-foreground">{transaction.date}</p>
              </div>
              <div className={`font-medium ${
                transaction.type === 'earned' ? 'text-green-600' : 'text-red-600'
              }`}>
                {transaction.type === 'earned' ? '+' : ''}{transaction.amount}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Marketplace() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="flex items-center gap-2">
            <ShoppingCart className="w-6 h-6" />
            Community Marketplace
          </h2>
          <p className="text-muted-foreground">Trade resources, tools, and knowledge</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          List Item
        </Button>
      </div>

      <Tabs defaultValue="browse" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="browse">Browse</TabsTrigger>
          <TabsTrigger value="listings">My Listings</TabsTrigger>
          <TabsTrigger value="points">Points & Wallet</TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="mt-6">
          <MarketplaceFeed />
        </TabsContent>

        <TabsContent value="listings" className="mt-6">
          <MyListings />
        </TabsContent>

        <TabsContent value="points" className="mt-6">
          <PointsWallet />
        </TabsContent>
      </Tabs>
    </div>
  );
}