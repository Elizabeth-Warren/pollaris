
import React, { useRef, useState, useEffect } from 'react';
import AnimateHeight from 'react-animate-height';
import get from 'lodash.get';

import compileRichText from 'wr/utils/compileRichText';
import dashSeperatedString from 'wr/utils/dashSeparatedString';
import transformRichTextGrouping from 'wr/utils/transformRichTextGrouping';

import Blocks from './style';

const HEADING_TYPE = 'heading-1';

function QuestionRow(props) {
  const {
    heading, content, pillarKey, isFirst,
  } = props;
  const [isActive, setIsActive] = useState();
  const pillarRef = useRef();
  const pillarButtonRef = useRef();

  useEffect(() => {
    if (window.location.hash === `#${pillarKey}`) {
      setIsActive(true);
    }
  }, []);

  function togglePillar() {
    if (!isActive) {
      const { history } = window;
      const hash = `#${pillarKey}`;
      if (history.replaceState) {
        history.replaceState(null, null, hash);
      }
    }
    setIsActive(!isActive);
  }

  return (
    <Blocks.AccordionRow id={pillarKey} isActive={isActive} key={pillarKey}>
      <Blocks.RowContainer isActive ref={pillarRef}>
        <Blocks.HeaderButton
          onClick={togglePillar}
          isActive={isActive}
          aria-expanded={isActive}
          aria-controls={heading}
          ref={pillarButtonRef}
          isFirst={isFirst}
        >
          <Blocks.PillarTitle isActive={isActive}>
            {heading}
          </Blocks.PillarTitle>
          <Blocks.PillarChevron isActive={isActive} />
        </Blocks.HeaderButton>
      </Blocks.RowContainer>
      <AnimateHeight
        duration={300}
        height={isActive ? 'auto' : 0}
        style={{ width: '100%' }}
        key={`${pillarKey}-animate`}
      >
        <Blocks.PillarContentContainer
          isActive={isActive}
          id={dashSeperatedString(heading)}
        >
          <Blocks.PillarContent>
            {content}
          </Blocks.PillarContent>
        </Blocks.PillarContentContainer>
      </AnimateHeight>
    </Blocks.AccordionRow>
  );
}

function FrequentlyAskedQuestions(props) {
  const { title, richText } = props;
  const { headings, content } = transformRichTextGrouping(HEADING_TYPE, richText.content);

  return (
    <Blocks.QuestionsSection>
      <Blocks.Banner>
        <Blocks.Header>{title}</Blocks.Header>
      </Blocks.Banner>
      {headings.map((heading, index) => {
        const headingString = get(heading, ['content', '0', 'value']);
        const pillarKey = dashSeperatedString(headingString);

        return (
          <QuestionRow
            key={pillarKey}
            heading={headingString}
            content={compileRichText()({
              ...richText,
              content: content[index],
            })}
            pillarKey={pillarKey}
            isFirst={index === 0}
          />
        );
      })}
    </Blocks.QuestionsSection>
  );
}

export default FrequentlyAskedQuestions;
