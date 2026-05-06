export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="border-t bg-background mt-auto">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
          <span>© {currentYear} Feedback Fusion. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}
