import { array, number, object, string } from 'yup';
import { toast } from 'react-toastify';
import { canisterId as userCanisterId } from '@/dfx/declarations/user';
import AddQuestionForm from '@/components/addQuestionForm/addQuizQuestionForm';
import React, { useEffect, useRef, useState } from 'react';
import { Row, Col, Form, Button, Table, Modal, Spinner } from 'react-bootstrap';
import { Formik, Field, ErrorMessage, FormikProps, FormikValues } from 'formik';
import { usePathname, useRouter } from 'next/navigation';
import { makeEntryActor } from '@/dfx/service/actor-locator';
import { ConnectPlugWalletSlice } from '@/types/store';
import { useConnectPlugWalletStore } from '@/store/useStore';
import { sliceString } from '@/constant/helperfuntions';
import { utcToLocalAdmin } from '@/components/utils/utcToLocal';
import { CAMPAIGN_TITLE_SLICE } from '@/constant/sizes';
export default function CampaignsListComponent({
  campaignsList,
  reGetFn,
}: {
  campaignsList: any[];
  reGetFn: any;
}) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [campaignId, setCampaignId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { identity } = useConnectPlugWalletStore((state) => ({
    identity: (state as ConnectPlugWalletSlice).identity,
  }));
  const entryActor = makeEntryActor({
    agentOptions: {
      identity,
    },
  });
  const handleDeleteModleClose = () => {
    setShowDeleteModal(false);
    setCampaignId('');
  };
  const handleDeleteModleOpen = () => {
    setShowDeleteModal(true);
  };

  let handleDeleteQuiz = async () => {
    setIsLoading(true);
    try {
      let deletedRes = await entryActor.delete_campaign(campaignId, userCanisterId);
      handleDeleteModleClose();
      setIsLoading(false);
      if (deletedRes?.ok) {
        toast.success('Campaign deleted successfully.');
        if (reGetFn) {
          reGetFn();
        }
      } else {
        toast.error(deletedRes?.err[0]);
      }
    } catch (error) {
      setIsLoading(false);
      toast.error('There is an error while deleting Campaign.');
    }
  };
  return (
    <>
      <Col xl='12' lg='12' md='12'>
        <div className='full-div'>
          <div className='table-container lg'>
            <div className='table-inner-container'>
              <Table striped hover className='article-table'>
                <thead>
                  <tr>
                  <th>
                      <p>Title</p>
                    </th>
                    <th>
                      <p>Start Date</p>
                    </th>
                    <th>
                      <p>End Date</p>
                    </th>
                    <th>
                      <p>Status</p>
                    </th>
                    <th className='centercls'>
                      <p>Action</p>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {campaignsList &&
                    campaignsList.map((item: any) => {
                      let id=item[0];
                      let entry=item[1];
                      let startDate =  utcToLocalAdmin(entry?.startDate.toString(), 'DD-MM-yyyy');;
                      let endDate =  utcToLocalAdmin(entry?.endDate.toString(), 'DD-MM-yyyy');;
                  

                     

                      return (
                        <tr key={id}>
                      <td>
                      <p className='mw-300'>
                                    {entry.title.slice(0, CAMPAIGN_TITLE_SLICE)}
                                    {entry.title.length > CAMPAIGN_TITLE_SLICE && '...'}{' '}
                                  </p>
                      </td>
                          <td>{startDate}</td>

                          <td>{endDate}</td>

                          <td>{entry.isActive ? 'Active' : 'deactivate'}</td>
                          <td className='centercls'>
                           
                            <ul className='quizBtnList'>
                              <li>
                              <Button
                              onClick={() => {
                              
                                router.push(
                                  `/super-admin/add-featured-campaign?campaignId=${id}`
                                );
                              }}
                              className='text-primary ps-0'
                            >
                              {'Edit'}
                            </Button>
                              </li>
                              <li>
                              <Button
                              onClick={() => {
                                handleDeleteModleOpen();
                                setCampaignId(id);
                              }}
                              className='text-danger ps-0'
                            >
                              {'Delete'}
                            </Button>
                              </li>
                            </ul>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </Table>
            </div>
          </div>
        </div>
      </Col>
      <Modal show={showDeleteModal} centered onHide={handleDeleteModleClose}>
        <Modal.Header>
          <h3 className='text-center'>
            Are you sure you want to delete this campaign.
          </h3>
        </Modal.Header>
        <Modal.Footer>
          <Button
            className='publish-btn me-2'
            onClick={handleDeleteQuiz}
            disabled={isLoading}
          >
            {isLoading ? <Spinner size='sm' /> : 'delete'}
          </Button>
          <Button
            className='default-btn'
            onClick={handleDeleteModleClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
