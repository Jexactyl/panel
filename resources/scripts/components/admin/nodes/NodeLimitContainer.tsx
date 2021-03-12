import React from 'react';
import AdminBox from '@/components/admin/AdminBox';
import tw from 'twin.macro';
import { number, object } from 'yup';
import Field from '@/components/elements/Field';
import SpinnerOverlay from '@/components/elements/SpinnerOverlay';
import { Form, Formik, FormikHelpers } from 'formik';
import { Context } from '@/components/admin/nodes/NodeEditContainer';
import { ApplicationStore } from '@/state';
import { Actions, useStoreActions } from 'easy-peasy';
import updateNode from '@/api/admin/nodes/updateNode';

interface Values {
    memory: number;
    memoryOverallocate: number;
    disk: number;
    diskOverallocate: number;
}

export default () => {
    const { clearFlashes, clearAndAddHttpError } = useStoreActions((actions: Actions<ApplicationStore>) => actions.flashes);

    const node = Context.useStoreState(state => state.node);
    const setNode = Context.useStoreActions(actions => actions.setNode);

    if (node === undefined) {
        return (
            <></>
        );
    }

    const submit = ({ memory, memoryOverallocate, disk, diskOverallocate }: Values, { setSubmitting }: FormikHelpers<Values>) => {
        clearFlashes('node');

        updateNode(node.id, { memory, memoryOverallocate, disk, diskOverallocate })
            .then(() => setNode({ ...node, memory, memoryOverallocate, disk, diskOverallocate }))
            .catch(error => {
                console.error(error);
                clearAndAddHttpError({ key: 'node', error });
            })
            .then(() => setSubmitting(false));
    };

    return (
        <Formik
            onSubmit={submit}
            initialValues={{
                memory: node.memory,
                memoryOverallocate: node.memoryOverallocate,
                disk: node.disk,
                diskOverallocate: node.diskOverallocate,
            }}
            validationSchema={object().shape({
                memory: number().required(),
                memoryOverallocate: number().required(),
                disk: number().required(),
                diskOverallocate: number().required(),
            })}
        >
            {
                ({ isSubmitting }) => (
                    <React.Fragment>
                        <AdminBox title={'Limits'} css={tw`w-full relative`}>
                            <SpinnerOverlay visible={isSubmitting}/>

                            <Form css={tw`mb-0`}>
                                <div css={tw`md:w-full md:flex md:flex-row mb-6`}>
                                    <div css={tw`md:w-full md:flex md:flex-col md:mr-4 mb-6 md:mb-0`}>
                                        <Field
                                            id={'memory'}
                                            name={'memory'}
                                            label={'Memory'}
                                            type={'number'}
                                        />
                                    </div>

                                    <div css={tw`md:w-full md:flex md:flex-col md:ml-4 mb-6 md:mb-0`}>
                                        <Field
                                            id={'memoryOverallocate'}
                                            name={'memoryOverallocate'}
                                            label={'Memory Overallocate'}
                                            type={'number'}
                                        />
                                    </div>
                                </div>

                                <div css={tw`md:w-full md:flex md:flex-row mb-6`}>
                                    <div css={tw`md:w-full md:flex md:flex-col md:mr-4 mb-6 md:mb-0`}>
                                        <Field
                                            id={'disk'}
                                            name={'disk'}
                                            label={'Disk'}
                                            type={'number'}
                                        />
                                    </div>

                                    <div css={tw`md:w-full md:flex md:flex-col md:ml-4 mb-6 md:mb-0`}>
                                        <Field
                                            id={'diskOverallocate'}
                                            name={'diskOverallocate'}
                                            label={'Disk Overallocate'}
                                            type={'number'}
                                        />
                                    </div>
                                </div>
                            </Form>
                        </AdminBox>
                    </React.Fragment>
                )
            }
        </Formik>
    );
};
