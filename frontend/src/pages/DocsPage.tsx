
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

const DocsPage: React.FC = () => {
    return (
        <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
                <h1 className="text-4xl font-bold tracking-tight">Developer Docs</h1>
                <p className="mt-4 text-lg text-muted-foreground">
                    A quick reference for the AegisCycle API and demo configuration.
                </p>
            </div>

            <section className="mt-16">
                <h2 className="text-2xl font-bold">API Endpoints</h2>
                <p className="mt-2 text-muted-foreground">The demo interacts with the following backend endpoints when "Mock Mode" is turned off.</p>
                <div className="mt-6 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Badge variant="secondary" className="mr-3">POST</Badge>
                                <span>/risk/score</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>Calculates the risk profile based on the provided intake data.</p>
                            <h4 className="font-semibold mt-4">Request Body</h4>
                            <pre className="mt-2 p-3 bg-slate-100 dark:bg-slate-800 rounded-md text-xs overflow-x-auto">
                                <code>{`{\n  "intake": Intake\n}`}</code>
                            </pre>
                             <h4 className="font-semibold mt-4">Response Body</h4>
                            <pre className="mt-2 p-3 bg-slate-100 dark:bg-slate-800 rounded-md text-xs overflow-x-auto">
                                <code>{`RiskResult`}</code>
                            </pre>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Badge variant="secondary" className="mr-3">POST</Badge>
                                <span>/plan/generate</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>Generates a personalized lifestyle plan.</p>
                            <h4 className="font-semibold mt-4">Request Body</h4>
                            <pre className="mt-2 p-3 bg-slate-100 dark:bg-slate-800 rounded-md text-xs overflow-x-auto">
                                <code>{`{\n  "intake": Intake\n}`}</code>
                            </pre>
                             <h4 className="font-semibold mt-4">Response Body</h4>
                            <pre className="mt-2 p-3 bg-slate-100 dark:bg-slate-800 rounded-md text-xs overflow-x-auto">
                                <code>{`Plan`}</code>
                            </pre>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Badge variant="secondary" className="mr-3">POST</Badge>
                                <span>/escalate/check</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>Checks if the intake data meets any clinical escalation criteria.</p>
                            <h4 className="font-semibold mt-4">Request Body</h4>
                            <pre className="mt-2 p-3 bg-slate-100 dark:bg-slate-800 rounded-md text-xs overflow-x-auto">
                                <code>{`{\n  "intake": Intake\n}`}</code>
                            </pre>
                             <h4 className="font-semibold mt-4">Response Body</h4>
                            <pre className="mt-2 p-3 bg-slate-100 dark:bg-slate-800 rounded-md text-xs overflow-x-auto">
                                <code>{`Escalation`}</code>
                            </pre>
                        </CardContent>
                    </Card>
                </div>
            </section>
            
            <section className="mt-16">
                 <h2 className="text-2xl font-bold">Configuration</h2>
                 <p className="mt-2 text-muted-foreground">How to switch between mock and live modes.</p>
                 <Card className="mt-6">
                    <CardContent className="pt-6">
                        <h3 className="font-semibold">Environment Variable</h3>
                        <p className="mt-2 text-sm text-muted-foreground">To enable live API calls, you must set the `NEXT_PUBLIC_API_URL` environment variable. In this simplified demo environment, this is controlled by editing the `API_BASE` constant in `lib/api.ts`.</p>
                        <pre className="mt-2 p-3 bg-slate-100 dark:bg-slate-800 rounded-md text-xs">
                             <code>{`// in lib/api.ts\nconst API_BASE = "https://your-api.com/v1";`}</code>
                        </pre>
                        <h3 className="font-semibold mt-6">Mock Mode Toggle</h3>
                        <p className="mt-2 text-sm text-muted-foreground">On the <a href="#/demo" className="text-primary underline">Demo Page</a>, a "Mock Mode" toggle allows you to switch between using local mock functions (`lib/mock.ts`) and making live HTTP requests to the configured API base URL. If the API URL is not set, the toggle will be disabled and the app will remain in mock mode.</p>
                    </CardContent>
                 </Card>
            </section>
        </div>
    );
};

export default DocsPage;
