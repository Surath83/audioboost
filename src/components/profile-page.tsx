"use client";

import React, { useState } from 'react';
import { useSettings } from '@/hooks/use-settings';
import { AUDIO_FREQUENCIES } from '@/lib/constants';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from './ui/button';
import { useAuth } from '@/hooks/use-auth';
import { User, LogOut } from 'lucide-react';
import ProfileEditForm from './profile-edit-form';
import HearingProfileChart from './hearing-profile-chart';

const ProfilePage = () => {
  const { settings, updateHearingProfile, resetSettings } = useSettings();
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  if (!user) {
    return (
      <div className="p-4 md:p-6 text-center">
        <p>Please log in to view your profile.</p>
      </div>
    );
  }

  const handleEditComplete = () => {
    setIsEditing(false);
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      <header className="flex justify-between items-center">
        <h1 className="text-3xl font-headline font-bold text-primary">Profile</h1>
        <Button variant="ghost" size="icon" onClick={logout}>
          <LogOut className="h-5 w-5" />
        </Button>
      </header>

      {isEditing ? (
        <ProfileEditForm user={user} onSave={handleEditComplete} onCancel={() => setIsEditing(false)} />
      ) : (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>{user.first_name} {user.last_name}</CardTitle>
              <CardDescription>@{user.username}</CardDescription>
            </div>
            <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
          </CardHeader>
          <CardContent className="space-y-2">
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Age:</strong> {user.age}</p>
            <p><strong>Gender:</strong> {user.gender}</p>
            <p><strong>Occupation:</strong> {user.occupation}</p>
            <p><strong>Phone:</strong> {user.phone_no}</p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Hearing Profile</CardTitle>
          <CardDescription>Your audiogram shows your hearing loss in decibels (dB) for each frequency.</CardDescription>
        </CardHeader>
        <CardContent>
          <HearingProfileChart leftEar={settings.leftEar} rightEar={settings.rightEar} />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Frequency Gains</CardTitle>
          <CardDescription>Adjust sliders to match your audiogram.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8 pt-2">
          {AUDIO_FREQUENCIES.map(freq => (
            <div key={freq} className="space-y-4">
              <label className="text-sm font-medium text-foreground">
                {freq >= 1000 ? `${freq / 1000} kHz` : `${freq} Hz`}
              </label>
              {/* Left Ear */}
              <div className="space-y-2">
                <div className="flex justify-between items-baseline">
                   <span className="text-xs text-blue-500 font-semibold">Left Ear</span>
                   <span className="text-md font-mono font-semibold text-blue-500 w-20 text-right">
                    {settings.leftEar[freq] || 0} dB
                  </span>
                </div>
                <Slider
                  min={0}
                  max={100}
                  step={5}
                  value={[settings.leftEar[freq] || 0]}
                  onValueChange={([value]) => updateHearingProfile('left', freq, value)}
                  className="[&>div>span]:bg-blue-500 [&>span]:bg-blue-500"
                />
              </div>
              {/* Right Ear */}
              <div className="space-y-2">
                <div className="flex justify-between items-baseline">
                   <span className="text-xs text-green-500 font-semibold">Right Ear</span>
                   <span className="text-md font-mono font-semibold text-green-500 w-20 text-right">
                    {settings.rightEar[freq] || 0} dB
                  </span>
                </div>
                <Slider
                  min={0}
                  max={100}
                  step={5}
                  value={[settings.rightEar[freq] || 0]}
                  onValueChange={([value]) => updateHearingProfile('right', freq, value)}
                   className="[&>div>span]:bg-green-500 [&>span]:bg-green-500"
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <Button variant="outline" onClick={resetSettings}>
          Reset Hearing Profile
        </Button>
      </div>
    </div>
  );
};

export default ProfilePage;
