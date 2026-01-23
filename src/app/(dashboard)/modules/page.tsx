'use client'

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Plus, Edit, Trash2, ArrowRight, Loader2 } from 'lucide-react';
import { getRequest, postRequest, putRequest, deleteRequest } from '@/lib/api/api-caller';
import { toast } from 'sonner';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';

// Type Definitions
interface Program { id: string; name: string; }
interface Class { id: string; name: string; program_id: string; }
interface Group { id: string; name: string; class_id: string; }
interface Subject { id: string; name: string; group_id: string; }
interface Chapter { id: string; name: string; subject_id: string; }
interface Topic { id: string; name: string; chapter_id: string; }

type CrudItem = Program | Class | Group | Subject | Chapter | Topic;
type EntityType = 'programs' | 'classes' | 'groups' | 'subjects' | 'chapters' | 'topics';

const HIERARCHY: EntityType[] = ['programs', 'classes', 'groups', 'subjects', 'chapters', 'topics'];

const API_ENDPOINTS: Record<EntityType, string> = {
  programs: '/api/programs',
  classes: '/api/classes',
  groups: '/api/groups',
  subjects: '/api/subjects',
  chapters: '/api/chapters',
  topics: '/api/topics',
};

const PARENT_KEYS: Partial<Record<EntityType, string>> = {
  classes: 'program_id',
  groups: 'class_id',
  subjects: 'group_id',
  chapters: 'subject_id',
  topics: 'chapter_id',
};

export default function ModulesPage() {
    const [columns, setColumns] = useState<Record<EntityType, CrudItem[]>>({
        programs: [], classes: [], groups: [], subjects: [], chapters: [], topics: [],
    });
    const [selections, setSelections] = useState<Partial<Record<EntityType, string | null>>>({});
    const [loading, setLoading] = useState<Partial<Record<EntityType, boolean>>>({});
    
    // Fetch initial programs
    useEffect(() => {
        fetchData('programs');
    }, []);
    
    const fetchData = useCallback(async (entity: EntityType, parentId?: string | null) => {
        setLoading(prev => ({ ...prev, [entity]: true }));
        try {
            const parentKey = PARENT_KEYS[entity];
            const url = parentId && parentKey ? `${API_ENDPOINTS[entity]}?${parentKey}=${parentId}` : API_ENDPOINTS[entity];
            const res: any = await getRequest(url);
            setColumns(prev => ({ ...prev, [entity]: res.data || [] }));
        } catch (error) {
            toast.error(`Failed to load ${entity}.`);
        } finally {
            setLoading(prev => ({ ...prev, [entity]: false }));
        }
    }, []);

    const handleSelect = (entity: EntityType, id: string | null) => {
        const currentIndex = HIERARCHY.indexOf(entity);
        const newSelections = { ...selections };

        // Clear all child selections
        for (let i = currentIndex + 1; i < HIERARCHY.length; i++) {
            const childEntity = HIERARCHY[i];
            newSelections[childEntity] = null;
            setColumns(prev => ({ ...prev, [childEntity]: [] }));
        }
        
        newSelections[entity] = id;
        setSelections(newSelections);

        // Fetch children of the newly selected item
        const nextEntity = HIERARCHY[currentIndex + 1];
        if (nextEntity && id) {
            fetchData(nextEntity, id);
        }
    };
    
    const onCrudOperation = (entity: EntityType) => {
        const parentEntity = HIERARCHY[HIERARCHY.indexOf(entity) - 1] as EntityType | undefined;
        fetchData(entity, parentEntity ? selections[parentEntity] : null);
    };

    const visibleColumns = HIERARCHY.filter(entity => {
        const parentEntity = HIERARCHY[HIERARCHY.indexOf(entity) - 1] as EntityType | undefined;
        return !parentEntity || selections[parentEntity];
    });

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-8">Modules Management</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {HIERARCHY.map((entity, index) => {
                    const parentEntity = HIERARCHY[index - 1] as EntityType | undefined;
                    const isVisible = !parentEntity || selections[parentEntity];
                    if (!isVisible) return null;

                    return (
                        <CrudColumn
                            key={entity}
                            title={entity.charAt(0).toUpperCase() + entity.slice(1)}
                            items={columns[entity]}
                            selectedItem={selections[entity] || null}
                            onSelect={(id) => handleSelect(entity, id)}
                            onCrudOperation={() => onCrudOperation(entity)}
                            apiEndpoint={API_ENDPOINTS[entity]}
                            parentId={parentEntity ? selections[parentEntity] : 'root'}
                            parentKey={PARENT_KEYS[entity]}
                            isLoading={loading[entity] || false}
                        />
                    );
                })}
            </div>
        </div>
    );
}

// ... CrudColumn component remains the same for now, but will be updated to handle merge
// For brevity, the logic will be added in the next step.
// This sets up the cascading UI.

interface CrudColumnProps {
    title: string;
    items: CrudItem[];
    selectedItem: string | null;
    onSelect: (id: string | null) => void;
    onCrudOperation: () => void;
    parentId?: string | null;
    apiEndpoint: string;
    parentKey?: string;
    isLoading: boolean;
}

function CrudColumn({ title, items, selectedItem, onSelect, onCrudOperation, parentId, apiEndpoint, parentKey, isLoading }: CrudColumnProps) {
    const [newItemName, setNewItemName] = useState('');
    const [editingItem, setEditingItem] = useState<CrudItem | null>(null);
    const [editingName, setEditingName] = useState('');
    const [dialogState, setDialogState] = useState({ isOpen: false, title: '', description: '', onConfirm: () => {} });

    const openDialog = (title: string, description: string, onConfirm: () => void) => {
        setDialogState({ isOpen: true, title, description, onConfirm });
    };

    const handleAddItem = async () => {
        if (!newItemName.trim() || (parentKey && !parentId)) return;
        try {
            const payload: any = { name: newItemName };
            if (parentKey && parentId) payload[parentKey] = parentId;
            await postRequest(apiEndpoint, payload);
            setNewItemName('');
            onCrudOperation();
            toast.success(`${title.slice(0, -1)} added.`);
        } catch (error) {
            toast.error(`Failed to add ${title.slice(0, -1)}.`);
        }
    };

    const handleUpdateItem = async () => {
        if (!editingItem || !editingName.trim()) return;

        // Check for potential merge
        const existingItem = items.find(item => item.name === editingName.trim() && item.id !== editingItem.id);
        if (existingItem) {
            openDialog(
                `Merge into "${existingItem.name}"?`,
                `An item with this name already exists. Merging will move all children of "${editingItem.name}" to "${existingItem.name}" and delete the old item. This cannot be undone.`,
                async () => {
                    try {
                        await putRequest('/api/merge', {
                            entity: title.toLowerCase(),
                            sourceId: editingItem.id,
                            targetId: existingItem.id
                        });
                        setEditingItem(null);
                        onCrudOperation();
                        toast.success("Merge successful.");
                    } catch (error) {
                        toast.error("Merge failed.");
                    }
                }
            );
        } else {
            // Standard update
            try {
                await putRequest(`${apiEndpoint}/${editingItem.id}`, { name: editingName });
                setEditingItem(null);
                onCrudOperation();
                toast.success(`${title.slice(0, -1)} updated.`);
            } catch (error) {
                toast.error(`Failed to update ${title.slice(0, -1)}.`);
            }
        }
    };

    const handleDeleteItem = async (id: string) => {
        openDialog(
            'Delete Item?',
            'Are you sure you want to delete this item? All of its children will also be deleted.',
            async () => {
                 try {
                    await deleteRequest(`${apiEndpoint}/${id}`);
                    onCrudOperation();
                    toast.success(`Item deleted.`);
                } catch (error) {
                    toast.error(`Failed to delete item.`);
                }
            }
        );
    };

    return (
        <Card className="flex flex-col">
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>Select an item to see its children</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col flex-grow">
                <div className="flex gap-2 mb-4">
                    <Input 
                        placeholder={`New ${title.slice(0, -1)}...`} 
                        value={newItemName}
                        onChange={(e) => setNewItemName(e.target.value)}
                        disabled={!!(parentKey && !parentId)}
                    />
                    <Button size="icon" onClick={handleAddItem} disabled={!!(parentKey && !parentId) || !newItemName.trim()}>
                        <Plus />
                    </Button>
                </div>
                 <div className="flex-grow h-96 relative">
                    {isLoading ? (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : (
                        <div className="absolute inset-0 overflow-y-auto space-y-2">
                            {items.map(item => (
                                <div key={item.id}>
                                    {editingItem?.id === item.id ? (
                                        <div className="flex gap-2 p-1 bg-muted rounded-md">
                                            <Input value={editingName} onChange={(e) => setEditingName(e.target.value)} autoFocus />
                                            <Button onClick={handleUpdateItem}>Save</Button>
                                            <Button variant="ghost" onClick={() => setEditingItem(null)}>X</Button>
                                        </div>
                                    ) : (
                                        <div 
                                            className={`p-2 rounded-md cursor-pointer flex justify-between items-center group ${selectedItem === item.id ? 'bg-primary/20' : 'hover:bg-accent'}`}
                                            onClick={() => onSelect(item.id)}
                                        >
                                            <span className="flex-grow">{item.name}</span>
                                            <div className="hidden group-hover:flex">
                                                <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); setEditingItem(item); setEditingName(item.name); }}>
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); handleDeleteItem(item.id); }}>
                                                    <Trash2 className="h-4 w-4 text-destructive" />
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                     )}
                </div>
            </CardContent>
             <ConfirmationDialog
                isOpen={dialogState.isOpen}
                onClose={() => setDialogState(prev => ({...prev, isOpen: false}))}
                onConfirm={() => {
                    dialogState.onConfirm();
                    setDialogState(prev => ({...prev, isOpen: false}));
                }}
                title={dialogState.title}
                description={dialogState.description}
            />
        </Card>
    );
}