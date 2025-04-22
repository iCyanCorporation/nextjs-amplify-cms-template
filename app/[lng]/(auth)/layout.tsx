"use client";

import React from "react";
import { Authenticator, ThemeProvider } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import "../../globals.css";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import Sidebar from "@/components/Sidebar";

Amplify.configure(outputs);

const theme = {
  name: "custom-theme",
  tokens: {
    colors: {
      background: {
        primary: {
          value: "#ffffff",
        },
        secondary: {
          value: "#f3f4f6",
        },
      },
      font: {
        primary: {
          value: "#111111",
        },
        interactive: {
          value: "#333333",
        },
      },
      brand: {
        primary: {
          10: "#e6f1fe",
          20: "#cce3fd",
          40: "#99c7fb",
          60: "#66aaf9",
          80: "#338ef7",
          90: "#1a81f6",
          100: "#0073f5",
        },
      },
    },
    components: {
      tabs: {
        item: {
          _focus: {
            color: { value: "#000000" },
          },
          _hover: {
            color: { value: "#000000" },
          },
          _active: {
            color: { value: "#000000" },
          },
        },
      },
      button: {
        primary: {
          backgroundColor: {
            value: "#000000",
          },
          color: {
            value: "#000000",
          },
          _hover: {
            backgroundColor: {
              value: "{colors.brand.primary.80}",
            },
            color: {
              value: "#777777",
            },
          },
          _active: {
            backgroundColor: {
              value: "{colors.brand.primary.90}",
            },
            color: {
              value: "#ffffff",
            },
          },
        },
      },
      fieldcontrol: {
        _focus: {
          borderColor: { value: "{colors.brand.primary.100}" },
        },
      },
      text: {
        color: { value: "#000000" },
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
    <div className="min-h-screen bg-gray-white">
      <ThemeProvider theme={theme}>
        <div className="flex min-h-screen w-full">
          <Authenticator className="max-w-md w-full m-auto px-4 py-6 ">
            <div className="ml-20 lg:ml-64 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
              <Sidebar />
              <div className="">{children}</div>
            </div>
          </Authenticator>
        </div>
      </ThemeProvider>
    </div>
  );
}
