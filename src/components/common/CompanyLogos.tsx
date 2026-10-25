import React from 'react';

export interface CompanyLogoProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  className?: string;
  colored?: boolean;
}

// 1. Spotify
export function SpotifyLogo({ size = 24, className = '', colored = false, ...props }: CompanyLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={colored ? '#1DB954' : 'currentColor'}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141 4.38-1.319 9.78-.719 13.5 1.56.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
    </svg>
  );
}

// 2. Apple / Apple Music
export function AppleLogo({ size = 24, className = '', colored = false, ...props }: CompanyLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={colored ? '#FA243C' : 'currentColor'}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.38c.62-.75 1.04-1.8 0.93-2.85-.9.04-1.99.6-2.61 1.34-.55.63-1.03 1.68-.9 2.7.99.08 2.02-.49 2.58-1.19z" />
    </svg>
  );
}

// 3. YouTube / YouTube Music
export function YouTubeLogo({ size = 24, className = '', colored = false, ...props }: CompanyLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {colored ? (
        <>
          <path
            d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z"
            fill="#FF0000"
          />
          <path d="M9.545 15.568V8.432L15.818 12l-6.273 3.568z" fill="#FFFFFF" />
        </>
      ) : (
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      )}
    </svg>
  );
}

// 4. SoundCloud
export function SoundCloudLogo({ size = 24, className = '', colored = false, ...props }: CompanyLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={colored ? '#FF5500' : 'currentColor'}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M11.56 8.87v9.42c.4-.04.79-.1 1.17-.19.04 0 .07-.03.07-.07V9.75c0-.05-.03-.08-.07-.09-.38-.45-.76-.73-1.17-.79zm-1.87.56v8.94c.39-.01.78-.05 1.17-.11.04 0 .07-.03.07-.07V9.52c0-.04-.03-.07-.07-.07-.38-.07-.77-.07-1.17-.02zm-1.87.89v7.94c.39.04.78.04 1.17.02.04 0 .07-.03.07-.07v-7.85c0-.04-.03-.07-.07-.07-.39 0-.78.01-1.17.03zm-1.87.97v6.86c.39.07.78.11 1.17.11.04 0 .07-.03.07-.07v-6.91c0-.04-.03-.07-.07-.07-.39.01-.78.03-1.17.08zm-1.87 1.25v5.52c.39.11.78.17 1.17.2.04 0 .07-.03.07-.07v-5.74c0-.04-.03-.07-.07-.07-.39.05-.78.1-1.17.16zm-1.87 1.76v3.66c.39.17.78.27 1.17.32.04 0 .07-.03.07-.07v-4.14c0-.04-.03-.07-.07-.06-.39.1-.78.19-1.17.29zm-1.87 1.95v1.65c.39.16.78.26 1.17.31.04 0 .07-.03.07-.07v-2.07c0-.04-.03-.07-.07-.06-.39.06-.78.14-1.17.24zm14.15-5.99c-.61 0-1.19.16-1.7.44.03.22.05.45.05.69v8.32c.57.17 1.15.26 1.76.26 2.91 0 5.27-2.18 5.27-4.86 0-2.67-2.36-4.85-5.38-4.85z" />
    </svg>
  );
}

// 5. Deezer
export function DeezerLogo({ size = 24, className = '', colored = false, ...props }: CompanyLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={colored ? '#A238FF' : 'currentColor'}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M6.02 14.76h3.11v2.33H6.02v-2.33zm0-3.11h3.11v2.33H6.02v-2.33zm0-3.11h3.11v2.33H6.02V8.54zm4.15 6.22h3.11v2.33h-3.11v-2.33zm0-3.11h3.11v2.33h-3.11v-2.33zm0-3.11h3.11v2.33h-3.11V8.54zm0-3.11h3.11v2.33h-3.11V5.43zm4.15 9.33h3.11v2.33h-3.11v-2.33zm0-3.11h3.11v2.33h-3.11v-2.33zm0-3.11h3.11v2.33h-3.11V8.54zm4.14 6.22h3.12v2.33h-3.12v-2.33zm0-3.11h3.12v2.33h-3.12v-2.33zm0-3.11h3.12v2.33h-3.12V8.54zm0-3.11h3.12v2.33h-3.12V5.43zm0-3.11h3.12v2.33h-3.12V2.32zM1.87 14.76h3.11v2.33H1.87v-2.33zm0 3.89h19.82V21H1.87v-2.35zm4.15 0h3.11" />
    </svg>
  );
}

// 6. Tidal
export function TidalLogo({ size = 24, className = '', colored = false, ...props }: CompanyLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={colored ? '#00FFFF' : 'currentColor'}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M12.012 3.992L8.008 8l4.004 4.008 4.008-4.008-4.008-4.008zM4.004 8L0 12.004l4.004 4.008L8.008 12 4.004 8zm8.008 8.016L8.008 12l4.004-4.008 4.008 4.008-4.008 4.016zm8.008-8.016l-4.004 4.008 4.004 4.008L24.02 12l-4.004-4zm-8.008 8.016l-4.004 4.008 4.004 4.008 4.008-4.008-4.008-4.008z" />
    </svg>
  );
}

// 7. Google (Reviews / Maps / Play)
export function GoogleLogo({ size = 24, className = '', colored = false, ...props }: CompanyLogoProps) {
  if (colored) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        className={className}
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        <path
          fill="#4285F4"
          d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
        />
        <path
          fill="#34A853"
          d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.27 21.44 7.33 24 12 24z"
        />
        <path
          fill="#FBBC05"
          d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.04 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
        />
        <path
          fill="#EA4335"
          d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.27 2.56 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
        />
      </svg>
    );
  }
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
    </svg>
  );
}

// 8. Trustpilot
export function TrustpilotLogo({ size = 24, className = '', colored = false, ...props }: CompanyLogoProps) {
  if (colored) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        className={className}
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="#00B67A" />
        <path d="M16.5 13.5l1.68 6.52L12 16.95v-7.68l4.5 4.23z" fill="#005128" />
      </svg>
    );
  }
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

// 9. Amazon / Amazon Music
export function AmazonLogo({ size = 24, className = '', colored = false, ...props }: CompanyLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={colored ? '#FF9900' : 'currentColor'}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M13.91 14.86c-1.42 1.34-3.4 1.48-5.07.67-.3-.15-.09-.5.18-.46 1.45.24 3.03-.04 4.31-.83.25-.15.58.12.58.62zm9.89 4.33c-.32.41-1.29.17-2.34-.33-2.61-1.26-6.16-1.89-9.5-1.89-3.9 0-7.79.88-10.87 2.5-.42.22-.75.05-.56-.37.95-2.07 4.21-3.69 8.24-4.22.42-.06.72.2.43.51-1.24 1.33-2.01 2.87-2.08 4.6 3.1-1.39 6.81-2.12 10.45-2.12 3.26 0 6.64.64 9.17 1.95.83.43.91.82.68 1.17zM22.02 17.3c-.28-.35-1.86-.17-2.58-.08-.22.03-.25-.14-.06-.27 1.25-.86 3.28-.61 3.52-.31.25.32-.13 2.37-1.3 3.32-.18.15-.35.07-.27-.12.28-.65.97-2.19.69-2.54zM9.54 5.37c3.15 0 4.7 1.83 4.7 4.77v4.61c0 .76.33 1.09 1.07 1.09.43 0 .76-.05.98-.16.16-.08.33.05.33.22v1.2c0 .16-.11.33-.33.38-.6.16-1.47.27-2.23.27-1.85 0-2.83-.87-2.83-2.56v-.55c-.98 1.85-2.4 2.83-4.52 2.83-2.56 0-4.36-1.58-4.36-4.08 0-2.89 2.07-4.41 5.94-4.41.98 0 1.96.11 2.83.33v-1.9c0-1.85-.98-2.78-3.05-2.78-1.58 0-3.32.65-4.41 1.47-.16.11-.33.05-.38-.11l-.55-1.52c-.05-.16 0-.33.16-.44 1.47-1.14 3.75-1.85 6.66-1.85zm1.53 6.97c-.71-.16-1.47-.27-2.29-.27-2.12 0-3.21.76-3.21 2.18 0 1.36.93 2.18 2.45 2.18 1.47 0 2.61-.82 3.05-2.07v-2.02z" />
    </svg>
  );
}

// 10. TripAdvisor
export function TripAdvisorLogo({ size = 24, className = '', colored = false, ...props }: CompanyLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={colored ? '#00AF87' : 'currentColor'}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M12 3.25c-4.48 0-8.22 3.2-9.1 7.47H.5v2.56h2.4a9.35 9.35 0 0 0 18.2 0h2.4v-2.56h-2.4a9.34 9.34 0 0 0-9.1-7.47zm0 2.22c3.48 0 6.36 2.54 6.89 5.86-1.3-.9-2.87-1.43-4.56-1.43-1.63 0-3.15.5-4.43 1.36a7.1 7.1 0 0 1 2.1-5.79zm-5.02 4.43a4.67 4.67 0 1 1 0 9.34 4.67 4.67 0 0 1 0-9.34zm10.04 0a4.67 4.67 0 1 1 0 9.34 4.67 4.67 0 0 1 0-9.34zm-10.04 2.23a2.44 2.44 0 1 0 0 4.88 2.44 2.44 0 0 0 0-4.88zm10.04 0a2.44 2.44 0 1 0 0 4.88 2.44 2.44 0 0 0 0-4.88z" />
    </svg>
  );
}

// 11. Yelp
export function YelpLogo({ size = 24, className = '', colored = false, ...props }: CompanyLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={colored ? '#D32323' : 'currentColor'}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M11.66 12.44l-5.69 3.3a1.44 1.44 0 0 1-1.99-.54l-1.07-1.85a1.44 1.44 0 0 1 .53-1.97l5.69-3.29 2.53 4.35zm.77 1.34l.01 6.57a1.44 1.44 0 0 1-1.44 1.44H8.86a1.44 1.44 0 0 1-1.44-1.43l-.01-6.58 5.02.01zm1.22-.72l5.7 3.28a1.44 1.44 0 0 1 .53 1.97l-1.08 1.86a1.44 1.44 0 0 1-1.98.53l-5.7-3.29 2.53-4.35zm.72-1.22l5.69-3.29a1.44 1.44 0 0 1 1.98.54l1.08 1.85a1.44 1.44 0 0 1-.53 1.98l-5.69 3.28-2.53-4.36zm-2.02-1.01V4.26A1.44 1.44 0 0 1 13.8 2.8h2.14a1.44 1.44 0 0 1 1.44 1.44v6.57l-5.03.02z" />
    </svg>
  );
}

// 12. Bol.com
export function BolLogo({ size = 24, className = '', colored = false, ...props }: CompanyLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={colored ? '#0000A4' : 'currentColor'}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle cx="12" cy="12" r="11" fill={colored ? '#0000A4' : 'currentColor'} />
      <path
        d="M6.5 7h4.2c2.1 0 3.3 1.1 3.3 2.7 0 1.1-.6 1.9-1.6 2.3 1.3.4 2.1 1.3 2.1 2.7 0 1.9-1.4 3.3-3.7 3.3H6.5V7zm3.8 4.2c.9 0 1.5-.4 1.5-1.2s-.6-1.2-1.5-1.2H8.8v2.4h1.5zm.3 4.9c1.1 0 1.8-.5 1.8-1.4 0-.9-.7-1.4-1.8-1.4H8.8v2.8h1.8z"
        fill={colored ? '#FFFFFF' : '#0B0B0F'}
      />
    </svg>
  );
}

// 13. Apple App Store
export function AppStoreLogo({ size = 24, className = '', colored = false, ...props }: CompanyLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={colored ? '#0D96F6' : 'currentColor'}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M18.72 17.54l-1.34-2.32H6.62l-1.34 2.32a.75.75 0 0 1-1.3-.75l6.35-11a.75.75 0 0 1 1.3 0l6.39 11a.75.75 0 0 1-1.3.75zM12 8.78L8.35 15.1h7.3z" />
      <rect x="2" y="2" width="20" height="20" rx="5" fill="none" stroke={colored ? '#0D96F6' : 'currentColor'} strokeWidth="1.5" />
    </svg>
  );
}

// 14. Google Play Store
export function PlayStoreLogo({ size = 24, className = '', colored = false, ...props }: CompanyLogoProps) {
  if (colored) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        className={className}
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        <path d="M3.6 1.8L14.2 12 3.6 22.2c-.4-.4-.6-1-.6-1.8V3.6c0-.8.2-1.4.6-1.8z" fill="#00C1A6" />
        <path d="M17.6 8.7L5.5.7C4.8.2 4.1.2 3.6 1.8L14.2 12l3.4-3.3z" fill="#FFD400" />
        <path d="M17.6 15.3l-3.4-3.3-10.6 10.2c.5 1.6 1.2 1.6 1.9 1.1l12.1-8z" fill="#FF3333" />
        <path d="M22.5 11.5l-4.9-3.2-3.4 3.7 3.4 3.7 4.9-3.2c.9-.6.9-1.4 0-2z" fill="#00B0FF" />
      </svg>
    );
  }
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M3.6 1.8L14.2 12 3.6 22.2c-.4-.4-.6-1-.6-1.8V3.6c0-.8.2-1.4.6-1.8zm14 6.9L5.5.7C4.8.2 4.1.2 3.6 1.8L14.2 12l3.4-3.3zm0 6.6l-3.4-3.3-10.6 10.2c.5 1.6 1.2 1.6 1.9 1.1l12.1-8zm4.9-3.8l-4.9-3.2-3.4 3.7 3.4 3.7 4.9-3.2c.9-.6.9-1.4 0-2z" />
    </svg>
  );
}

// 15. KPN (Dutch Residential ISP Node Provider)
export function KpnLogo({ size = 24, className = '', colored = false, ...props }: CompanyLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle cx="6" cy="12" r="4.5" fill={colored ? '#009900' : 'currentColor'} />
      <circle cx="18" cy="7.5" r="3.5" fill={colored ? '#00A3E0' : 'currentColor'} />
      <circle cx="18" cy="16.5" r="3.5" fill={colored ? '#009900' : 'currentColor'} />
      <path
        d="M6 12h12"
        stroke={colored ? '#009900' : 'currentColor'}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

// 16. Ziggo (Dutch Residential Cable/Fiber ISP Node Provider)
export function ZiggoLogo({ size = 24, className = '', colored = false, ...props }: CompanyLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={colored ? '#F37021' : 'currentColor'}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14.5c-2.48 0-4.5-2.02-4.5-4.5 0-1.8 1.07-3.34 2.6-4.04l.85 1.82c-.88.4-1.45 1.28-1.45 2.22 0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5c0-.62-.23-1.19-.61-1.63l1.52-1.32c.68.79 1.09 1.82 1.09 2.95 0 2.48-2.02 4.5-4.5 4.5z" />
    </svg>
  );
}

// 17. Cloudflare
export function CloudflareLogo({ size = 24, className = '', colored = false, ...props }: CompanyLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={colored ? '#F38020' : 'currentColor'}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M18.67 11.23a4.7 4.7 0 0 0-4.48-3.41c-.48 0-.94.08-1.37.22A5.87 5.87 0 0 0 7.2 6a5.88 5.88 0 0 0-5.74 4.67 4.16 4.16 0 0 0 .54 8.28h16.67a3.53 3.53 0 0 0 3.53-3.53 3.54 3.54 0 0 0-3.53-4.19zm-.67 6.47H2a2.82 2.82 0 0 1-.37-5.61l.92-.12-.13-.92A4.54 4.54 0 0 1 6.84 7.3a4.54 4.54 0 0 1 4.51 3.25l.33 1.08 1.09-.28c.31-.08.64-.12.98-.12a3.36 3.36 0 0 1 3.35 3.36v.44l.43.09a2.21 2.21 0 0 1 1.77 2.16c0 1.23-.98 2.22-2.2 2.22z" />
    </svg>
  );
}

// 18. Stripe
export function StripeLogo({ size = 24, className = '', colored = false, ...props }: CompanyLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={colored ? '#635BFF' : 'currentColor'}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C17.652.684 14.887 0 12.016 0 6.643 0 2.875 2.84 2.875 7.424c0 4.634 3.96 5.814 6.878 6.945 2.062.8 2.766 1.488 2.766 2.457 0 .973-.839 1.488-2.288 1.488-2.072 0-4.88-.934-6.852-2.052L2.5 21.84c2.274 1.066 5.613 1.91 8.877 1.91 5.613 0 9.748-2.677 9.748-7.394 0-4.423-3.676-5.875-7.149-7.206z" />
    </svg>
  );
}

// 19. Quantum Initium (Holding Network Emblem)
export function QuantumInitiumLogo({ size = 24, className = '', colored = false, ...props }: CompanyLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle cx="12" cy="12" r="9" stroke={colored ? '#E5C583' : 'currentColor'} strokeWidth="1.5" strokeDasharray="2 2" />
      <polygon points="12 4 19 8 19 16 12 20 5 16 5 8" stroke={colored ? '#E5C583' : 'currentColor'} strokeWidth="1.5" fill="none" />
      <circle cx="12" cy="12" r="3" fill={colored ? '#E5C583' : 'currentColor'} />
    </svg>
  );
}

// 20. Djobba.works (Talent & Gateway)
export function DjobbaLogo({ size = 24, className = '', colored = false, ...props }: CompanyLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect x="3" y="3" width="18" height="18" rx="4" stroke={colored ? '#38BDF8' : 'currentColor'} strokeWidth="1.5" />
      <path d="M8 8h4.5a3.5 3.5 0 0 1 0 7H8V8z" fill={colored ? '#38BDF8' : 'currentColor'} />
      <circle cx="16" cy="15" r="1.5" fill={colored ? '#E5C583' : 'currentColor'} />
    </svg>
  );
}

// Unified Logo resolver by string id
export function CompanyLogo({
  name,
  size = 24,
  className = '',
  colored = false,
  ...props
}: CompanyLogoProps & { name: string }) {
  const normalized = name.toLowerCase().replace(/[^a-z0-9]/g, '');

  switch (normalized) {
    case 'spotify':
    case 'spotifystreams':
      return <SpotifyLogo size={size} className={className} colored={colored} {...props} />;
    case 'apple':
    case 'applemusic':
      return <AppleLogo size={size} className={className} colored={colored} {...props} />;
    case 'youtube':
    case 'youtubemusic':
      return <YouTubeLogo size={size} className={className} colored={colored} {...props} />;
    case 'soundcloud':
      return <SoundCloudLogo size={size} className={className} colored={colored} {...props} />;
    case 'deezer':
      return <DeezerLogo size={size} className={className} colored={colored} {...props} />;
    case 'tidal':
      return <TidalLogo size={size} className={className} colored={colored} {...props} />;
    case 'google':
    case 'googlemaps':
    case 'googlereviews':
      return <GoogleLogo size={size} className={className} colored={colored} {...props} />;
    case 'trustpilot':
      return <TrustpilotLogo size={size} className={className} colored={colored} {...props} />;
    case 'amazon':
    case 'amazonmusic':
      return <AmazonLogo size={size} className={className} colored={colored} {...props} />;
    case 'tripadvisor':
      return <TripAdvisorLogo size={size} className={className} colored={colored} {...props} />;
    case 'yelp':
      return <YelpLogo size={size} className={className} colored={colored} {...props} />;
    case 'bol':
    case 'bolcom':
      return <BolLogo size={size} className={className} colored={colored} {...props} />;
    case 'appstore':
      return <AppStoreLogo size={size} className={className} colored={colored} {...props} />;
    case 'playstore':
    case 'googleplay':
      return <PlayStoreLogo size={size} className={className} colored={colored} {...props} />;
    case 'kpn':
      return <KpnLogo size={size} className={className} colored={colored} {...props} />;
    case 'ziggo':
      return <ZiggoLogo size={size} className={className} colored={colored} {...props} />;
    case 'cloudflare':
      return <CloudflareLogo size={size} className={className} colored={colored} {...props} />;
    case 'stripe':
      return <StripeLogo size={size} className={className} colored={colored} {...props} />;
    case 'quantuminitium':
      return <QuantumInitiumLogo size={size} className={className} colored={colored} {...props} />;
    case 'djobba':
    case 'djobbaworks':
      return <DjobbaLogo size={size} className={className} colored={colored} {...props} />;
    default:
      return <SpotifyLogo size={size} className={className} colored={colored} {...props} />;
  }
}
