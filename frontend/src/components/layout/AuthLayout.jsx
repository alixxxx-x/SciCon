import React from 'react';

const AuthLayout = ({ children, title, subtitle }) => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background p-6">
            <div className="w-full max-w-[400px] space-y-6">
                <div className="flex flex-col space-y-2 text-center">
                    <h1 className="text-2xl font-semibold tracking-tight">
                        {title}
                    </h1>
                    {subtitle && (
                        <p className="text-sm text-muted-foreground">
                            {subtitle}
                        </p>
                    )}
                </div>
                {children}
            </div>
        </div>
    );
};

export default AuthLayout;
