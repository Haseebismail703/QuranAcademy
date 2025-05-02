export const AdditionalSections = () => {
    return (
      <>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SectionCard title="Projects" content="Project content would appear here." />
          <SectionCard 
            title="Orders History" 
            content="Order history content would appear here." 
          />
        </div>
  
        <SectionCard 
          title="Additional Content" 
          content={
            <>
              <p className="mb-4">
                This extra content is added to demonstrate the scrolling behavior.
              </p>
              <p className="mb-4">
                The sidebar and header remain fixed while only this main content
                area scrolls.
              </p>
              <p className="mb-4">
                This ensures easy navigation and access to all dashboard
                functionality at all times.
              </p>
            </>
          } 
        />
      </>
    );
  };
  
  const SectionCard = ({ title, content }) => (
    <div className="bg-white rounded-lg shadow p-4 sm:p-6 mt-6">
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      <div className="mt-4 text-sm text-gray-500">
        {content}
      </div>
    </div>
  );