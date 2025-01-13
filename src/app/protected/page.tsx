export default function ProtectedPage() {
  return (
    <div className="container max-w-2xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">Protected Route</h1>
      <p className="text-muted-foreground">
        You have successfully accessed the protected route with a valid API key.
      </p>
    </div>
  );
}
