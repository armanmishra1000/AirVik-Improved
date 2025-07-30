import React from 'react';
import IconTest from '@/components/IconTest';
import EnhancedUIDemo from '@/components/EnhancedUIDemo';
import ColorDemo from '@/components/ColorDemo';

export const metadata = {
  title: 'UI Components Demo | Airvik Hotel System',
  description: 'Demonstration of Shadcn UI components with React Icons and Lucide Icons integration',
};

export default function UIDemoPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-primary text-3xl font-bold mb-6">UI Components Demo</h1>
      <p className="text-muted mb-8">
        This page demonstrates the integration of Shadcn UI with React Icons and Lucide Icons.
      </p>
      
      <div className="space-y-12">
        {/* Brand Colors Demo */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Brand Colors</h2>
          <ColorDemo />
        </section>

        {/* Basic Icon Test */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Basic Icon Integration</h2>
          <IconTest />
        </section>
        
        {/* Enhanced UI Demo */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Enhanced UI Components</h2>
          <EnhancedUIDemo />
        </section>
      </div>
      
      <div className="mt-12 p-6 bg-muted rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Implementation Notes</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>Shadcn UI is successfully installed and configured</li>
          <li>React Icons library is integrated and working</li>
          <li>Lucide Icons library is integrated and working</li>
          <li>All components are styled with Tailwind CSS</li>
          <li>Components installed: Button, Card, Input, Badge</li>
          <li>Icon libraries: React Icons (FaHotel, MdEmail, etc.) and Lucide (Search, Home, etc.)</li>
        </ul>
        
        <div className="mt-6 pt-4 border-t border-border">
          <h3 className="text-lg font-medium mb-2">Usage Instructions</h3>
          <ol className="list-decimal pl-5 space-y-2">
            <li>Import Shadcn UI components from <code>@/components/ui/[component-name]</code></li>
            <li>Import React Icons with <code>import &#123; IconName &#125; from 'react-icons/[collection]'</code></li>
            <li>Import Lucide Icons with <code>import &#123; IconName &#125; from 'lucide-react'</code></li>
            <li>Use icons within components as shown in the examples above</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
