import { AWSConfigForm } from "@/components/aws/aws-config-form";

export default function AWSConfigPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">AWS Integration</h1>
      <AWSConfigForm />
    </div>
  );
}
