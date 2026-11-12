export default function ErrorBox({ message }: { message: string }) {
  return <div className="text-red-500">{message}</div>;
}
