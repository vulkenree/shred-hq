"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Users, MapPin, Calendar, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/lib/auth-context';
import { RESORTS, getResortByName } from '@/lib/resorts';
import { createTrip, joinTripByCode, getUserTrips } from '@/lib/firestore-helpers';
import { Trip } from '@/types';
import { toast } from 'sonner';

export default function TripPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'create' | 'join'>('create');
  const [loading, setLoading] = useState(false);
  const [existingTrips, setExistingTrips] = useState<Trip[]>([]);

  // Create trip form
  const [tripName, setTripName] = useState('');
  const [selectedResort, setSelectedResort] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Join trip form
  const [inviteCode, setInviteCode] = useState('');

  useEffect(() => {
    async function loadTrips() {
      if (user) {
        const trips = await getUserTrips(user.uid);
        setExistingTrips(trips);
      }
    }
    loadTrips();
  }, [user]);

  const handleCreateTrip = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const resort = getResortByName(selectedResort);
    if (!resort) {
      toast.error('Please select a resort');
      return;
    }

    setLoading(true);
    try {
      const tripId = await createTrip({
        name: tripName,
        resort: selectedResort,
        location: { lat: resort.lat, lng: resort.lng },
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        createdBy: user.uid,
      });

      toast.success('Trip created!');
      router.push(`/trip/${tripId}/mountain`);
    } catch (error) {
      console.error('Error creating trip:', error);
      toast.error('Failed to create trip');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinTrip = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const tripId = await joinTripByCode(inviteCode, user.uid);
      if (tripId) {
        toast.success('Joined trip!');
        router.push(`/trip/${tripId}/mountain`);
      } else {
        toast.error('Invalid invite code');
      }
    } catch (error) {
      console.error('Error joining trip:', error);
      toast.error('Failed to join trip');
    } finally {
      setLoading(false);
    }
  };

  const goToTrip = (tripId: string) => {
    router.push(`/trip/${tripId}/mountain`);
  };

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-md mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold font-display">Your Trips</h1>
          <p className="text-muted-foreground mt-1">Create a new trip or join with a code</p>
        </div>

        {/* Existing Trips */}
        {existingTrips.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-sm font-medium text-muted-foreground">Continue a Trip</h2>
            {existingTrips.map(trip => (
              <Card
                key={trip.id}
                className="cursor-pointer hover:border-primary/50 transition-colors"
                onClick={() => goToTrip(trip.id)}
              >
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{trip.name}</p>
                    <p className="text-sm text-muted-foreground truncate">{trip.resort}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Tab Buttons */}
        <div className="flex gap-2 p-1 bg-muted rounded-lg">
          <button
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'create'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
            onClick={() => setActiveTab('create')}
          >
            <Plus className="w-4 h-4 inline mr-2" />
            Create Trip
          </button>
          <button
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'join'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
            onClick={() => setActiveTab('join')}
          >
            <Users className="w-4 h-4 inline mr-2" />
            Join Trip
          </button>
        </div>

        {/* Create Trip Form */}
        {activeTab === 'create' && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Create a Trip</CardTitle>
              <CardDescription>Start a new trip and invite your crew</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateTrip} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="tripName">Trip Name</Label>
                  <Input
                    id="tripName"
                    placeholder="Tahoe 2026"
                    value={tripName}
                    onChange={(e) => setTripName(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="resort">Resort</Label>
                  <Select value={selectedResort} onValueChange={setSelectedResort} required>
                    <SelectTrigger id="resort">
                      <SelectValue placeholder="Select a resort" />
                    </SelectTrigger>
                    <SelectContent>
                      {RESORTS.map(resort => (
                        <SelectItem key={resort.name} value={resort.name}>
                          {resort.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    'Create Trip'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Join Trip Form */}
        {activeTab === 'join' && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Join a Trip</CardTitle>
              <CardDescription>Enter the 6-character code from your crew</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleJoinTrip} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="inviteCode">Invite Code</Label>
                  <Input
                    id="inviteCode"
                    placeholder="ABC123"
                    value={inviteCode}
                    onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                    maxLength={6}
                    className="text-center text-lg tracking-widest font-mono uppercase"
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={loading || inviteCode.length !== 6}>
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    'Join Trip'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
