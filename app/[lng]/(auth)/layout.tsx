"use client";

import React from "react";
import { Authenticator, ThemeProvider } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";

import { Amplify } from "aws-amplify";
Amplify.configure(outputs);
import outputs from "@/amplify_outputs.json";

import Link from "next/link";

const theme = {
  name: 'custom-theme',
  tokens: {
    colors: {
      background: {
        primary: {
          value: '#ffffff',
        },
        secondary: {
          value: '#f3f4f6',
        },
      },
      font: {
        primary: {
          value: '#111111',
        },
        interactive: {
          value: '#333333',
        },
      },
      brand: {
        primary: {
          10: '#e6f1fe',
          20: '#cce3fd',
          40: '#99c7fb',
          60: '#66aaf9',
          80: '#338ef7',
          90: '#1a81f6',
          100: '#0073f5',
        },
      },
    },
    components: {
      tabs: {
        item: {
          _focus: {
            color: { value: '#000000' },
          },
          _hover: {
            color: { value: '#000000' },
          },
          _active: {
            color: { value: '#000000' },
          },
        },
      },
      button: {
        primary: {
          backgroundColor: {
            value: '#000000',
          },
          color: {
            value: '#000000'
          },
          _hover: {
            backgroundColor: {
              value: '{colors.brand.primary.80}',
            },
            color: {
              value: '#777777'
            }
          },
          _active: {
            backgroundColor: {
              value: '{colors.brand.primary.90}',
            },
            color: {
              value: '#ffffff'
            }
          },
        },
      },
      fieldcontrol: {
        _focus: {
          borderColor: { value: '{colors.brand.primary.100}' },
        },
      },
      text: {
        color: { value: '#000000' },
      },
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container h-screen w-full flex">
      <div className="p-2"><Link href="/admin">Admin</Link></div>
      <div className="w-full">
        <ThemeProvider theme={theme}>
          <Authenticator>{children}</Authenticator>
        </ThemeProvider>
      </div>
    </div>
  );
}
