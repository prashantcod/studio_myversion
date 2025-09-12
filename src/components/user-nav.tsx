"use client";

import Link from "next/link";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { placeholderImages } from "@/lib/placeholder-images.json"
import { useRouter } from "next/navigation";

type UserNavProps = {
  userType?: 'admin' | 'teacher' | 'student';
}

export function UserNav({ userType = 'admin' }: UserNavProps) {
  const router = useRouter();
  
  // Use different avatars based on user type
  const avatarId = userType === 'teacher' ? 'teacher-avatar' : 'user-avatar';
  const userAvatar = placeholderImages.find(img => img.id === avatarId);

  const users = {
    admin: {
      name: 'Admin',
      email: 'admin@university.edu',
      fallback: 'AD',
    },
    teacher: {
      name: 'Dr. Jane Doe',
      email: 'jane.doe@university.edu',
      fallback: 'JD',
    },
    student: {
      name: 'John Smith',
      email: 'john.smith@university.edu',
      fallback: 'JS'
    }
  }

  const currentUser = users[userType];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full p-0">
          <Avatar className="h-8 w-8">
            {userAvatar && <AvatarImage src={userAvatar.imageUrl} alt="User avatar" data-ai-hint={userAvatar.imageHint} />}
            <AvatarFallback>{currentUser.fallback}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{currentUser.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {currentUser.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            Profile
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Settings
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => { localStorage.removeItem('auth'); router.push('/login'); }}>
          Log out
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
