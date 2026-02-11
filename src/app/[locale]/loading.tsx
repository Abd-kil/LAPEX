import LoadingLogo from "@/app/components/ui/LoadingLogo";

export default function Loading() {
  return (
    <div
      className="fixed inset-0 z-[1000] flex h-screen items-center justify-center bg-background"
    >
      <LoadingLogo />
    </div>
  );
}
