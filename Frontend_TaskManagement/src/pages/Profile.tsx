import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Camera, Mail, User, Save, X } from 'lucide-react';
import { toast } from 'sonner';
import { userApi } from '@/api/userApi';
import { UserAvatar } from '@/components/common/UserAvatar';

export default function Profile() {
    const { state, dispatch } = useApp();
    const { currentUser } = state;

    const [isEditting, setIsEditting] = useState(false);
    const [formData, setFormData] = useState({
        name: currentUser?.name || '',
        email: currentUser?.email || '',
        avatar: currentUser?.avatar || '',
    });

    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        // Nối API ở đây
        if (!currentUser) return;

        try {
            // gọi 1 Api duy nhất
            const response = await userApi.updateProfile({
                fullname: formData.name,
                avatarUrl: formData.avatar // truyền trực tiếp file vào
            });

            // giả sử backend trả về user object mới nhất sau khi update
            const updateUser = response.data;

            // cập nhật Context
            dispatch({
                type: 'UPDATE_USER',
                payload: {
                    ...currentUser,
                    name: updateUser.fullName,
                    avatar: updateUser.avatarUrl
                }
            })

            setIsEditting(false);
            setSelectedFile(null);
            toast.success('User updated successfully');

        } catch (error) {
            console.error(error);
            toast.error('Failed to update user');
        }
    };

    const handleCancel = () => {
        setFormData({
            name: currentUser?.name || '',
            email: currentUser?.email || '',
            avatar: currentUser?.avatar || '',
        });
        setIsEditting(false);
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const result = e.target?.result as string;
                handleInputChange('avatar', result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <MainLayout
            title="Profile"
            subtitle="Here's what's happening in your workspace today."
            showNewTaskButton={false}
        >
            <div className="container mx-auto py-8 px-4 max-w-4xl">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">Individual Information</h1>
                    <p className="text-muted-foreground">View and edit your profile information</p>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    {/* Avatar section */}
                    <Card className="md:col-span-1">
                        <CardHeader className="text-center">
                            <div className="relative mx-auto w-fit">
                                <UserAvatar
                                    name={formData.name}
                                    avatarUrl={formData.avatar}
                                    size="xl"
                                />

                                {isEditting && (
                                    <div className="absolute bottom-0 right-0">
                                        <label htmlFor="avatar-upload" className="cursor-pointer">
                                            <div className="bg-primary text-primary-foreground rounded-full p-2 shadow-lg hover:bg-primary/90 transition-colors">
                                                <Camera className="h-4 w-4" />
                                            </div>
                                            <input
                                                id="avatar-upload"
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={handleAvatarChange}
                                            />
                                        </label>
                                    </div>
                                )}
                            </div>

                            <div className="mt-4">
                                <CardTitle className="text-xl">{currentUser?.name}</CardTitle>
                                <CardDescription className="flex items-center justify-center gap-2 mt-2">
                                    <Badge variant="secondary">{currentUser?.role}</Badge>
                                </CardDescription>
                            </div>
                        </CardHeader>
                    </Card>

                    {/* Profile Info */}
                    <Card className="md:col-span-2">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Individual Information</CardTitle>
                                <CardDescription>Update information</CardDescription>
                            </div>

                            {!isEditting ? (
                                <Button onClick={() => setIsEditting(true)}>
                                    <User className="h-4 w-4 mr-2" /> Edit
                                </Button>
                            ) : (
                                <div className="flex gap-2">
                                    <Button onClick={handleSave} size="sm">
                                        <Save className="h-4 w-4 mr-2" />
                                        Save
                                    </Button>
                                    <Button onClick={handleCancel} size="sm" variant="outline">
                                        <X className="h-4 w-4 mr-2" />
                                        Cancel
                                    </Button>
                                </div>
                            )}
                        </CardHeader>

                        <CardContent className="space-y-6">
                            <div className="grid gap-4">
                                {/* Name */}
                                <div className="grid gap-2">
                                    <Label htmlFor="name" className="flex items-center gap-2">
                                        <User className="h-4 w-4" /> Full Name
                                    </Label>
                                    {isEditting ? (
                                        <Input
                                            id="name"
                                            value={formData.name}
                                            onChange={(e) => handleInputChange('name', e.target.value)}
                                        />
                                    ) : (
                                        <div className="p-2 bg-muted rounded-md">{currentUser?.name}</div>
                                    )}
                                </div>

                                {/* Email */}
                                <div className="grid gap-2">
                                    <Label htmlFor="email" className="flex items-center gap-2">
                                        <Mail className="h-4 w-4" /> Email
                                    </Label>
                                    {isEditting ? (
                                        <Input
                                            id="email"
                                            value={formData.email}
                                            onChange={(e) => handleInputChange('email', e.target.value)}
                                        />
                                    ) : (
                                        <div className="p-2 bg-muted rounded-md">{currentUser?.email}</div>
                                    )}
                                </div>
                            </div>

                            <Separator />

                            {/* Statistics */}
                            <div>
                                <h3 className="font-semibold mb-4">Statistic Active</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="text-center p-4 bg-muted rounded-lg">
                                        <div className="text-2xl font-bold text-primary">
                                            {state.tasks.filter(task => task.assignees.includes(currentUser?.id || '')).length}
                                        </div>
                                        <div className="text-sm text-muted-foreground">Tasks Assigned</div>
                                    </div>

                                    <div className="text-center p-4 bg-muted rounded-lg">
                                        <div className="text-2xl font-bold text-green-600">
                                            {state.tasks.filter(
                                                task =>
                                                    task.assignees.includes(currentUser?.id || '') &&
                                                    task.status === 'completed'
                                            ).length}
                                        </div>
                                        <div className="text-sm text-muted-foreground">Tasks Completed</div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Activity */}
                <Card className="mt-6">
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                        <CardDescription>Latest updates</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {state.activities
                                .filter(a => a.userId === currentUser?.id)
                                .slice(0, 5)
                                .map(activity => {
                                    const task = state.tasks.find(t => t.id === activity.taskId);

                                    return (
                                        <div key={activity.id} className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
                                            <div className="flex-1">
                                                <p className="text-sm">
                                                    <span className="font-medium">You</span> {activity.description}{' '}
                                                    {task && <span className="font-medium">"{task.title}"</span>}
                                                </p>

                                                <p className="text-xs text-muted-foreground mt-1">
                                                    {new Date(activity.timestamp).toLocaleString('vi-VN')}
                                                </p>
                                            </div>

                                            {activity.priority && (
                                                <Badge
                                                    variant={
                                                        activity.priority === 'urgent'
                                                            ? 'destructive'
                                                            : activity.priority === 'high'
                                                                ? 'default'
                                                                : 'secondary'
                                                    }
                                                >
                                                    {activity.priority}
                                                </Badge>
                                            )}
                                        </div>
                                    );
                                })}

                            {state.activities.filter(a => a.userId === currentUser?.id).length === 0 && (
                                <p className="text-center text-muted-foreground">No activities found</p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </MainLayout>
    );
}
