import Container from "~/app/_components/ui/Container";
import TextPairing from "~/app/_components/ui/TextPairing";

export default function Page() {
  return (
    <Container>
      <TextPairing
        label="Mi bebe"
        sublabel="An app for tracking your babies' events"
      />
    </Container>
  );
}
