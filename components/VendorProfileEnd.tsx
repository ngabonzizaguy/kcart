      {/* Chat Modal */}
      <ChatModal
        language={language}
        vendorName={finalVendorData.name}
        vendorImage={finalVendorData.image}
        isOpen={showChatModal}
        onClose={() => setShowChatModal(false)}
      />
    </div>
  );
}