import styled from 'styled-components'

const Section = styled.section`
  margin-bottom: 36px;

  &:last-child {
    margin-bottom: 0;
  }
`

const SectionHeading = styled.h2`
  margin: 0 0 12px;
  font-size: 18px;
  font-weight: 500;
  color: ${({ theme }) => theme.textPrimary};
  letter-spacing: -0.01em;
`

const Paragraph = styled.p`
  margin: 0 0 12px;
  font-size: 14px;
  line-height: 1.65;
  color: ${({ theme }) => theme.textBody};

  &:last-child {
    margin-bottom: 0;
  }
`

export function ExampleContent() {
  return (
    <>
      <Section id="overview">
        <SectionHeading>Overview</SectionHeading>
        <Paragraph>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
          ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat.
        </Paragraph>
        <Paragraph>
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
          dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat
          non proident, sunt in culpa qui officia deserunt mollit anim id est
          laborum.
        </Paragraph>
        <Paragraph>
          Curabitur pretium tincidunt lacus. Nulla gravida orci a odio. Nullam
          varius, turpis et commodo pharetra, est eros bibendum elit, nec
          luctus magna felis sollicitudin mauris. Integer in mauris eu nibh
          euismod gravida.
        </Paragraph>
      </Section>

      <Section id="concepts">
        <SectionHeading>Concepts</SectionHeading>
        <Paragraph>
          Sed ut perspiciatis unde omnis iste natus error sit voluptatem
          accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae
          ab illo inventore veritatis et quasi architecto beatae vitae dicta
          sunt explicabo.
        </Paragraph>
        <Paragraph>
          Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut
          fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem
          sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia
          dolor sit amet, consectetur, adipisci velit.
        </Paragraph>
        <Paragraph>
          At vero eos et accusamus et iusto odio dignissimos ducimus qui
          blanditiis praesentium voluptatum deleniti atque corrupti quos
          dolores et quas molestias excepturi sint occaecati cupiditate non
          provident, similique sunt in culpa.
        </Paragraph>
        <Paragraph>
          Et harum quidem rerum facilis est et expedita distinctio. Nam libero
          tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo
          minus id quod maxime placeat facere possimus.
        </Paragraph>
      </Section>

      <Section id="sources">
        <SectionHeading>Sources</SectionHeading>
        <Paragraph>
          Temporibus autem quibusdam et aut officiis debitis aut rerum
          necessitatibus saepe eveniet ut et voluptates repudiandae sint et
          molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente
          delectus, ut aut reiciendis voluptatibus maiores alias.
        </Paragraph>
        <Paragraph>
          Praesent vestibulum molestie lacus. Aenean nonummy hendrerit mauris.
          Phasellus porta. Fusce suscipit varius mi. Cum sociis natoque
          penatibus et magnis dis parturient montes, nascetur ridiculus mus.
        </Paragraph>
        <Paragraph>
          Nulla dui. Fusce feugiat malesuada odio. Morbi nunc odio, gravida at,
          cursus nec, luctus a, lorem. Maecenas tristique orci ac sem. Duis
          ultricies pharetra magna. Donec accumsan malesuada orci.
        </Paragraph>
      </Section>

      <Section id="discussion">
        <SectionHeading>Discussion</SectionHeading>
        <Paragraph>
          Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse
          quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat
          quo voluptas nulla pariatur. Sed ut perspiciatis unde omnis iste
          natus error sit voluptatem.
        </Paragraph>
        <Paragraph>
          Vivamus euismod mauris. In ut quam vitae odio lacinia tincidunt.
          Praesent ut ligula non mi varius sagittis. Cras sagittis. Praesent ac
          sem eget est egestas volutpat.
        </Paragraph>
        <Paragraph>
          Vivamus consectetuer hendrerit lacus. Cras non dolor. Vivamus in erat
          ut urna cursus vestibulum. Fusce commodo aliquam arcu. Nam commodo
          suscipit quam.
        </Paragraph>
        <Paragraph>
          Quisque id mi. Ut tincidunt tincidunt erat. Etiam feugiat lorem non
          metus. Vestibulum dapibus nunc ac augue. Curabitur vestibulum aliquam
          leo.
        </Paragraph>
      </Section>
    </>
  )
}
