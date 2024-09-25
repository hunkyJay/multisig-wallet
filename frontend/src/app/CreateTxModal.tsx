import React, { useState } from "react";
import { Button, Modal, Form, Message } from "semantic-ui-react";
import useAsync from "../components/useAsync";
import { useWeb3Context } from "../contexts/Web3";
import { submitTx } from "../api/multisig-wallet";
import './MultiSigWallet.css';

interface Props {
    open: boolean;
    onClose: (event?: any) => void;
}

interface SubmitTxParams {
    to: string;
    value: string;
    data: string;
}

const CreateTxModal: React.FC<Props> = ({ open, onClose }) => {
    const {
        state: { web3, account },
    } = useWeb3Context();

    const { pending, error, call } = useAsync<SubmitTxParams, any>(
        async (params) => {
            if (!web3) {
                throw new Error("No web3");
            }

            await submitTx(web3, account, params);
        }
    );

    const [inputs, setInputs] = useState({
        to: "",
        value: "",
        data: "",
    });

    function onChange(name: string, e: React.ChangeEvent<HTMLInputElement>) {
        setInputs({
            ...inputs,
            [name]: e.target.value,
        });
    }

    async function onSubmit() {
        if (pending) {
            return;
        }

        // Check data, default 0x00
        const params = {
            ...inputs,
            value: inputs.value.toString(),
            data: inputs.data || "0x00",
        };

        const { error } = await call(params);

        if (!error) {
            onClose();
        }
    }

    return (
        <Modal open={open} onClose={onClose}>
            <Modal.Header>Create Transaction</Modal.Header>
            <Modal.Content>
                {error && <Message error>{error.message}</Message>}
                <Form onSubmit={onSubmit}>
                    <Form.Field>
                        <label>To</label>
                        <Form.Input
                            type="text"
                            value={inputs.to}
                            onChange={(e) => onChange("to", e)}
                            placeholder="The account address"
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Value</label>
                        <Form.Input
                            type="number"
                            min={1}
                            value={inputs.value}
                            onChange={(e) => onChange("value", e)}
                            placeholder="Wei to transfer" 
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Data</label>
                        <Form.Input
                            value={inputs.data}
                            onChange={(e) => onChange("data", e)}
                            placeholder="Optional data in hex"
                        />
                    </Form.Field>
                </Form>
            </Modal.Content>
            <Modal.Actions>
                <Button className="Action-button" onClick={onClose} disabled={pending}>
                    Cancel
                </Button>
                <Button className="Action-button"
                    color="green"
                    onClick={onSubmit}
                    disabled={pending}
                    loading={pending}
                >
                    Create
                </Button>
            </Modal.Actions>
        </Modal>
    );
};

export default CreateTxModal;