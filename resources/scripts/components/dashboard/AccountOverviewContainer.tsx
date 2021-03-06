import * as React from 'react';
import ContentBox from '@/components/elements/ContentBox';
import UpdatePasswordForm from '@/components/dashboard/forms/UpdatePasswordForm';
import UpdateEmailAddressForm from '@/components/dashboard/forms/UpdateEmailAddressForm';
import PageContentBlock from '@/components/elements/PageContentBlock';
import tw from 'twin.macro';
import { breakpoint } from '@/theme';
import styled from 'styled-components/macro';
import MessageBox from '@/components/MessageBox';
import { useLocation } from 'react-router-dom';
import UpdateUsernameForm from './forms/UpdateUsernameForm';
import { useStoreState } from 'easy-peasy';
import ConfigureTwoFactorForm from '@/components/dashboard/forms/ConfigureTwoFactorForm';

const Container = styled.div`
  ${tw`flex flex-wrap`};

  & > div {
    ${tw`w-full`};

    ${breakpoint('sm')`
      width: calc(50% - 1rem);
    `}

    ${breakpoint('md')`
      ${tw`w-auto flex-1`};
    `}
  }
`;

export default () => {
    const { state } = useLocation<{ twoFactorRedirect?: boolean } | undefined>();
    const usernameEdit = useStoreState(state => state.settings.data!.usernameEdit);

    return (
        <PageContentBlock title={'Account Overview'}>
            {state?.twoFactorRedirect &&
            <MessageBox title={'2-Factor Required'} type={'error'}>
                Your account must have two-factor authentication enabled in order to continue.
            </MessageBox>
            }
            <Container
                css={[ tw`lg:grid mb-10`,
                    state?.twoFactorRedirect ? tw`mt-4` : tw`mt-10`,
                    usernameEdit === '1' ? tw`lg:grid-cols-2` : tw`lg:grid-cols-3`,
                ]}
            >
                <ContentBox
                    css={tw`mt-8 sm:ml-8`}
                    title={'Update Email Address'}
                    showFlashes={'account:email'}
                >
                    <UpdateEmailAddressForm/>
                </ContentBox>
                {usernameEdit === '1' &&
                    <ContentBox
                        css={tw`lg:ml-8 mt-8`}
                        title={'Update Username'}
                        showFlashes={'account:username'}
                    >
                        <UpdateUsernameForm/>
                    </ContentBox>
                }
                <ContentBox title={'Update Password'} css={tw`mt-8 lg:ml-8`} showFlashes={'account:password'}>
                    <UpdatePasswordForm/>
                </ContentBox>
                <ContentBox css={tw`lg:ml-8 mt-8`} title={'Configure Two Factor'}>
                    <ConfigureTwoFactorForm/>
                </ContentBox>
            </Container>

        </PageContentBlock>
    );
};
