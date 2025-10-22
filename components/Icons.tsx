import React from 'react';

export const Icon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  />
);

export const Moon = (props: React.SVGProps<SVGSVGElement>) => (
  <Icon {...props}>
    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
  </Icon>
);

export const Sun = (props: React.SVGProps<SVGSVGElement>) => (
  <Icon {...props}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2" />
    <path d="M12 20v2" />
    <path d="m4.93 4.93 1.41 1.41" />
    <path d="m17.66 17.66 1.41 1.41" />
    <path d="M2 12h2" />
    <path d="M20 12h2" />
    <path d="m6.34 17.66-1.41 1.41" />
    <path d="m19.07 4.93-1.41 1.41" />
  </Icon>
);

export const Activity = (props: React.SVGProps<SVGSVGElement>) => (
    <Icon {...props}><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></Icon>
);

export const Heart = (props: React.SVGProps<SVGSVGElement>) => (
    <Icon {...props}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></Icon>
);

export const Brain = (props: React.SVGProps<SVGSVGElement>) => (
    <Icon {...props}><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.97-3.41 2.5 2.5 0 0 1 .45-3.03 2.5 2.5 0 0 1 2.5-1.95 2.5 2.5 0 0 1 2.4-2.28 2.5 2.5 0 0 1 2.43-2.31V4.5A2.5 2.5 0 0 1 9.5 2z"></path><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.97-3.41 2.5 2.5 0 0 0-.45-3.03 2.5 2.5 0 0 0-2.5-1.95 2.5 2.5 0 0 0-2.4-2.28 2.5 2.5 0 0 0-2.43-2.31V4.5A2.5 2.5 0 0 0 14.5 2z"></path></Icon>
);

export const FileWarning = (props: React.SVGProps<SVGSVGElement>) => (
    <Icon {...props}><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline><path d="M12 16v-4"></path><path d="M12 20h.01"></path></Icon>
);

export const Shield = (props: React.SVGProps<SVGSVGElement>) => (
    <Icon {...props}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></Icon>
);

export const X = (props: React.SVGProps<SVGSVGElement>) => (
    <Icon {...props}><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></Icon>
);
export const Info = (props: React.SVGProps<SVGSVGElement>) => (
    <Icon {...props}><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></Icon>
);
export const CheckCircle = (props: React.SVGProps<SVGSVGElement>) => (
    <Icon {...props}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></Icon>
);
export const AlertCircle = (props: React.SVGProps<SVGSVGElement>) => (
    <Icon {...props}><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></Icon>
);

export const Bot = (props: React.SVGProps<SVGSVGElement>) => (
    <Icon {...props}><rect x="3" y="11" width="18" height="10" rx="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path><line x1="7" y1="15" x2="7.01" y2="15"></line><line x1="17" y1="15" x2="17.01" y2="15"></line></Icon>
);

export const ArrowRight = (props: React.SVGProps<SVGSVGElement>) => (
    <Icon {...props}><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></Icon>
);

export const Apple = (props: React.SVGProps<SVGSVGElement>) => (
  <Icon {...props} strokeWidth="1.5">
    <path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-2.5 6-7 0-3.1-2.4-6-5-6-1.75 0-3.08.8-4 2-1.17-1.42-2.83-2.2-4.5-2.2-3.3 0-6 2.7-6 6 0 3.3 2.5 7 6.5 7 1.9 0 3.5-1.5 3.5-3.5a.5.5 0 0 0-.5-.5.5.5 0 0 0-.5.5c0 .94-1.2 1.94-2.5 1.94-2.5 0-4.5-2.2-4.5-5s2-5 4.5-5c1.7 0 3.2 1.2 4.2 2.7a.5.5 0 0 0 .9 0c1-1.5 2.5-2.7 4.2-2.7 2.2 0 4 1.8 4 5 0 3.3-2.7 6-5 6-.7 0-1.4-.2-2-.5a.5.5 0 0 0-.4.9c.7.4 1.4.6 2.4.6zM12 5.5c-.6 0-1-.4-1-1V1.5a.5.5 0 0 0-1 0V4c0 .8.7 1.5 1.5 1.5a.5.5 0 0 0 0-1z" />
  </Icon>
);