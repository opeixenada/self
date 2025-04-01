import React from 'react';
import AnimatedLink from '../components/AnimatedLink.tsx';

const Card: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="card-theme">
    <div className="card-theme-header">
      <h3 className="card-theme-title">{title}</h3>
    </div>
    <div className="p-4">{children}</div>
  </div>
);

const ThemePreview = () => {
  return (
    <div className="container mx-auto max-w-5xl p-6 pt-14">
      <header className="text-center">
        <h1>Theme</h1>
      </header>

      <main className="grid grid-cols-1 gap-6 py-10 md:grid-cols-2 lg:grid-cols-3">
        {/* Typography Card */}
        <Card title="Typography">
          <div className="space-y-4">
            <h1>Heading 1</h1>
            <h2>Heading 2</h2>
            <h3>Heading 3</h3>
            <p className="text-theme-text-secondary">
              Regular paragraph text with an{' '}
              <AnimatedLink className="font-semibold" href={'#'}>
                animated link
              </AnimatedLink>{' '}
              that adapts to the current theme.
            </p>
          </div>
        </Card>

        {/* Buttons Card */}
        <Card title="Buttons">
          <div className="space-y-4">
            <button className="btn-theme-outline w-full">Outline Button</button>
          </div>
        </Card>

        {/* Form Elements Card */}
        <Card title="Form Elements">
          <div className="space-y-4">
            <div>
              <label className="label-theme">Input Field</label>
              <input type="text" className="input-theme" placeholder="Type something..." />
            </div>

            <div>
              <label className="label-theme">Dropdown</label>
              <select className="select-theme">
                <option>Option 1</option>
                <option>Option 2</option>
                <option>Option 3</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Colors Card */}
        <Card title="Colors">
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="color-sample bg-theme-rose">
                <span className="text-sm font-medium text-black">Rose</span>
              </div>
              <div className="color-sample bg-theme-coral">
                <span className="text-sm font-medium text-black">Coral</span>
              </div>
              <div className="color-sample bg-theme-gold">
                <span className="text-sm font-medium text-black">Gold</span>
              </div>
              <div className="color-sample bg-theme-amber">
                <span className="text-sm font-medium text-black">Amber</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Text Colors Card */}
        <Card title="Text Colors">
          <div className="space-y-2">
            <p className="text-theme-text-primary">Primary Text Color</p>
            <p className="text-theme-text-secondary">Secondary Text Color</p>
            <p className="text-theme-text-muted">Muted Text Color</p>
          </div>
        </Card>

        {/* Notifications Card */}
        <Card title="Notifications">
          <div className="space-y-3">
            <div className="notification-success">
              <p className="text-sm">Success! Everything is working properly.</p>
            </div>

            <div className="notification-error">
              <p className="text-sm">Error: Something needs attention.</p>
            </div>

            <div className="notification-themed">
              <p className="text-sm">Themed notification. Somwthing else has happened.</p>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default ThemePreview;
