import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { spaceApi } from '@/api/spaceApi';
import { Loader2 } from 'lucide-react';

interface InviteMemberDialogProps {
    isOpen: boolean;
    onClose: () => void;
    spaceId: string;
}

export function InviteMemberDialog({ isOpen, onClose, spaceId }: InviteMemberDialogProps) {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleInvite = async () => {
        if (!email) {
            toast.error('Please enter an email address');
            return;
        }

        setIsLoading(true);
        try {
            await spaceApi.inviteMember(spaceId, email);
            toast.success('Member invited successfully');
            setEmail('');
            onClose();
        } catch (error) {
            console.error(error);
            toast.error('Failed to invite member. Check if email exists.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Invite to Space</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email address</Label>
                        <Input
                            id="email"
                            placeholder="colleague@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose} disabled={isLoading}>
                        Cancel
                    </Button>
                    <Button onClick={handleInvite} disabled={isLoading}>
                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Invite
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
