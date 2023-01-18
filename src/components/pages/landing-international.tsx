import { faArrowCircleRight } from '@fortawesome/free-solid-svg-icons/faArrowCircleRight'

import { Link } from '../content/link'
import { FaIcon } from '../fa-icon'
import { HeadTags } from '../head-tags'
import { PrinciplesGraphic } from '../landing/principles-graphic'
import ParticipateSVG from '@/assets-webkit/img/footer-participate.svg'
import { LandingSubjectsNew } from '@/components/landing/rework/landing-subjects-new'
import { useInstanceData } from '@/contexts/instance-context'
import { InstanceLandingData } from '@/data-types'
import { breakpoints } from '@/helper/breakpoints'
import { colors } from '@/helper/colors'

export interface LandingInternationalProps {
  data: InstanceLandingData
}

export function LandingInternational({ data }: LandingInternationalProps) {
  const landingStrings = data.strings
  const subjectsData = data.subjectsData
  const { strings } = useInstanceData()

  return (
    <>
      <HeadTags data={{ title: strings.header.slogan }} />
      <section className="section">
        <p className="serlo-p ml-0">{landingStrings.vision}</p>
        <Link className="serlo-button-light -ml-1" href="/serlo">
          {landingStrings.learnMore} <FaIcon icon={faArrowCircleRight} />
        </Link>
      </section>
      <section className="mb-14">
        <LandingSubjectsNew data={subjectsData} />
      </section>

      <section className="principles-section bg-brand px-side lg:px-side-lg">
        <PrinciplesGraphic strings={landingStrings} />
      </section>

      <section className="section">
        <h2 className="text-brand">{landingStrings.wikiTitle}</h2>
        <p className="serlo-p ml-0">{landingStrings.wikiText}</p>
      </section>

      <section className="image-section" />

      <section className="section">
        <h2 className="text-brand">{landingStrings.movementTitle}</h2>
        <div className="icon-style">
          <ParticipateSVG />
        </div>
        <div className="col">
          <p className="serlo-p ml-0">{landingStrings.callForAuthors}</p>
          <Link href="/community" className="serlo-button-light -ml-1">
            {landingStrings.communityLink} <FaIcon icon={faArrowCircleRight} />
          </Link>
        </div>
        <div className="col">
          <p className="serlo-p ml-0">{landingStrings.callForOther}</p>
          <Link href="/get-involved" className="serlo-button-light -ml-1">
            {landingStrings.getInvolved} <FaIcon icon={faArrowCircleRight} />
          </Link>
        </div>
      </section>
      <style jsx>{`
        .section {
          margin-top: 60px;
          margin-bottom: 60px;
          padding-left: 16px;
          padding-right: 16px;

          @media (min-wdith: ${breakpoints.sm}) {
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
          }

          @media (min-wdith: ${breakpoints.lg}) {
            max-width: 900px;
            margin-left: auto;
            margin-right: auto;
            padding-left: 40px;
            padding-right: 40px;
          }
        }
        .col {
          margin-top: 40px;

          @media (min-wdith: ${breakpoints.sm}) {
            margin-top: 0;
            margin-right: 30px;
            flex: 1;

            & > p {
              min-height: 80px;
            }

            &:last-child {
              margin-right: 0;
            }
          }

          @media (min-wdith: ${breakpoints.lg}) {
            margin-right: 50px;
          }
          display: flex;
          flex-direction: column;
          align-items: flex-start;

          :global(.a) {
            /* ? */
            margin-top: auto;
          }

          margin-bottom: 60px;
        }
        .image-section {
          background-size: contain;
          background-repeat: no-repeat;
          padding-top: 43.75%;

          background-image: url('https://packages.serlo.org/serlo-org-client@13.0.4/home_img_launch_sm.570e34cd.jpg');

          @media (min-wdith: ${breakpoints.sm}) {
            background-image: url('https://packages.serlo.org/serlo-org-client@13.0.4/home_img_launch_md.333b0782.jpg');
          }

          @media (min-wdith: ${breakpoints.md}) {
            background-image: url('https://packages.serlo.org/serlo-org-client@13.0.4/home_img_launch_lg.b46ea2e2.jpg');
          }
        }
        h2 {
          font-size: 1.66rem;
          border: 0;
          @media (min-wdith: ${breakpoints.sm}) {
            width: 100%;
          }
        }
        .principles-section {
          text-align: center;
          padding-top: 70px;
          padding-bottom: 70px;

          & > :global(svg) {
            height: 450px;
            width: 100%;
            font-family: inherit;
          }
        }
        .icon-style {
          & > :global(path),
          & :global(.st0) {
            fill: ${colors.brandGreen};
          }
          width: 100px;
          margin-right: 30px;
          @media (min-wdith: ${breakpoints.lg}) {
            margin-right: 50px;
            width: 120px;
          }
        }
      `}</style>
    </>
  )
}
