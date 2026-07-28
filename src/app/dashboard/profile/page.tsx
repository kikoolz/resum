import { getDb } from "@/db";
import { resumes, userSubscriptions } from "@/db/schema";
import { requireSession } from "@/lib/auth-server";
import { getAiUsageInfo } from "@/lib/ai-usage";
import { eq, desc } from "drizzle-orm";
import {
    FileText,
    Mail,
    Shield,
    Clock,
    CheckCircle2,
    CreditCard,
    Calendar,
    Star,
    Zap,
    Sparkles,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import Link from "next/link";

export default async function ProfilePage() {
    const session = await requireSession();
    const db = await getDb();

    // Fetch user resumes
    const userResumes = await db.query.resumes.findMany({
        where: eq(resumes.userId, session.user.id),
        columns: { id: true, firstName: true, lastName: true, updatedAt: true },
        orderBy: [desc(resumes.updatedAt)],
    });

    // Fetch subscription
    const subscription = await db.query.userSubscriptions.findFirst({
        where: eq(userSubscriptions.userId, session.user.id),
    });

    // Fetch AI token usage for current month
    const aiUsage = await getAiUsageInfo(session.user.id);

    const user = session.user;
    const initials = user.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

    // Stats
    const totalResumes = userResumes.length;
    const recentlyUpdated = userResumes.filter(
        (r) => r.updatedAt > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    ).length;
    const completed = userResumes.filter(
        (r) => r.firstName && r.lastName,
    ).length;

    // Subscription details
    const isPro = !!subscription && subscription.stripeCancelAtPeriodEnd === false; // Simplified logic
    const planName = isPro ? "Pro Plan" : "Free Plan";
    const renewalDate = subscription?.stripeCurrentPeriodEnd
        ? format(subscription.stripeCurrentPeriodEnd, "MMMM d, yyyy")
        : null;

    return (
        <div className="container mx-auto max-w-5xl px-4 py-8 space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Profile & Settings</h1>
                    <p className="mt-1 text-muted-foreground">
                        Manage your account, subscription, and preferences.
                    </p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* User Info Card */}
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>Personal Information</CardTitle>
                        <CardDescription>Your basic account details</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
                            <Avatar className="h-24 w-24 border-4 border-background shadow-sm">
                                <AvatarImage src={user.image || undefined} alt={user.name} />
                                <AvatarFallback className="text-3xl">{initials}</AvatarFallback>
                            </Avatar>
                            <div className="space-y-1 text-center sm:text-left flex-1">
                                <div className="flex flex-col sm:flex-row items-center sm:items-baseline gap-4">
                                    <h3 className="text-2xl font-bold">{user.name}</h3>
                                    <span className="text-xs text-muted-foreground">
                                        Joined {format(user.createdAt, "MMMM d, yyyy")}
                                    </span>
                                </div>
                                <div className="flex items-center justify-center sm:justify-start gap-2 text-muted-foreground">
                                    <Mail className="h-4 w-4" />
                                    <span>{user.email}</span>
                                </div>
                                <div className="pt-2 flex flex-wrap justify-center sm:justify-start gap-2">
                                    <Badge variant="secondary" className="px-2 py-1">
                                        <Shield className="mr-1 h-3 w-3" />
                                        {user.emailVerified ? "Verified Account" : "Account Active"}
                                    </Badge>
                                    <Badge variant={isPro ? "default" : "outline"} className="px-2 py-1">
                                        {isPro ? <Zap className="mr-1 h-3 w-3 fill-current" /> : null}
                                        {planName}
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Subscription Card */}
                <Card className="flex flex-col">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CreditCard className="h-5 w-5" />
                            Subscription
                        </CardTitle>
                        <CardDescription>Current plan details</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 space-y-4">
                        <div className="rounded-lg border p-4 bg-muted/40">
                            <div className="flex items-center justify-between mb-2">
                                <span className="font-medium">Current Plan</span>
                                <Badge variant={isPro ? "default" : "secondary"}>{planName}</Badge>
                            </div>
                            <div className="text-2xl font-bold">
                                {isPro ? "$19.00" : "$0.00"}
                                <span className="text-sm font-normal text-muted-foreground">/month</span>
                            </div>
                        </div>

                        {subscription ? (
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Status</span>
                                    <span className="font-medium capitalize">{subscription.stripeCancelAtPeriodEnd ? "Canceled" : "Active"}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Renewal Date</span>
                                    <span className="font-medium">{renewalDate}</span>
                                </div>
                            </div>
                        ) : (
                            <div className="text-sm text-muted-foreground">
                                You are currently on the free tier. Upgrade to unlock premium features.
                            </div>
                        )}
                    </CardContent>
                    <CardFooter>
                        <Link href="/dashboard/billing" className="w-full">
                            <Button className="w-full" variant={isPro ? "outline" : "default"}>
                                {isPro ? "Manage Subscription" : "Upgrade to Pro"}
                            </Button>
                        </Link>
                    </CardFooter>
                </Card>
            </div>

            {/* Usage Stats */}
            <h2 className="text-xl font-semibold tracking-tight pt-4">Usage Statistics</h2>
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Resumes</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalResumes}</div>
                        <p className="text-xs text-muted-foreground">
                            Created across all time
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{recentlyUpdated}</div>
                        <p className="text-xs text-muted-foreground">
                            Resumes updated this week
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
                        <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {totalResumes > 0 ? Math.round((completed / totalResumes) * 100) : 0}%
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Resumes with basic info filled
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* AI Usage */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Sparkles className="h-5 w-5 text-primary" />
                            <CardTitle>AI Usage</CardTitle>
                        </div>
                        <Badge variant={aiUsage.usagePercent >= 90 ? "destructive" : aiUsage.usagePercent >= 70 ? "secondary" : "outline"}>
                            {aiUsage.usagePercent}% used
                        </Badge>
                    </div>
                    <CardDescription>
                        Your AI token consumption for this month
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Progress value={aiUsage.usagePercent} className="h-3" />
                    {/* <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                            {aiUsage.totalTokens.toLocaleString()} / {aiUsage.limit.toLocaleString()} tokens
                        </span>
                        <span className="text-muted-foreground">
                            {aiUsage.callCount} AI {aiUsage.callCount === 1 ? "call" : "calls"} this month
                        </span>
                    </div> */}
                    {aiUsage.usagePercent >= 90 && (
                        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
                            You&apos;re approaching your monthly AI limit. Upgrade to premium for unlimited access.
                        </div>
                    )}
                </CardContent>
                {!isPro && (
                    <CardFooter>
                        <Link href="/dashboard/billing" className="w-full">
                            <Button className="w-full" variant="outline">
                                <Zap className="mr-2 h-4 w-4" />
                                Upgrade for unlimited AI usage
                            </Button>
                        </Link>
                    </CardFooter>
                )}
            </Card>
        </div>
    );
}
